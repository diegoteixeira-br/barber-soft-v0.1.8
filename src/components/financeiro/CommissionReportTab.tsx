import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DollarSign, Wallet, TrendingUp } from "lucide-react";
import { useFinancialData, getMonthRange, calculateCommission, calculateProfit } from "@/hooks/useFinancialData";
import { useBarbers } from "@/hooks/useBarbers";
import { useCurrentUnit } from "@/contexts/UnitContext";
import { RevenueCard } from "./RevenueCard";
import { CommissionTable } from "./CommissionTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function CommissionReportTab() {
  const { currentUnitId } = useCurrentUnit();
  const { barbers } = useBarbers(currentUnitId);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  const dateRange = useMemo(
    () => getMonthRange(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const { appointments, isLoading } = useFinancialData(dateRange, selectedBarberId);

  // Calculate totals
  const totals = useMemo(() => {
    return appointments.reduce(
      (acc, apt) => {
        const commission = calculateCommission(apt.total_price, apt.barber?.commission_rate ?? null);
        const profit = calculateProfit(apt.total_price, apt.barber?.commission_rate ?? null);
        return {
          total: acc.total + apt.total_price,
          commission: acc.commission + commission,
          profit: acc.profit + profit,
        };
      },
      { total: 0, commission: 0, profit: 0 }
    );
  }, [appointments]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i, 1), "MMMM", { locale: ptBR }),
  }));

  // Generate year options (last 3 years)
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-muted/30 border border-border">
        <div className="space-y-2">
          <Label>Mês</Label>
          <Select
            value={String(selectedMonth)}
            onValueChange={(v) => setSelectedMonth(Number(v))}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={String(month.value)}>
                  {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ano</Label>
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Barbeiro</Label>
          <Select
            value={selectedBarberId || "all"}
            onValueChange={(v) => setSelectedBarberId(v === "all" ? null : v)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Barbeiros</SelectItem>
              {barbers.map((barber) => (
                <SelectItem key={barber.id} value={barber.id}>
                  {barber.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenueCard
          title={selectedBarber ? `Total Faturado - ${selectedBarber.name}` : "Total Faturado"}
          value={formatCurrency(totals.total)}
          subtitle={`${appointments.length} atendimento(s)`}
          icon={DollarSign}
          variant="default"
        />
        <RevenueCard
          title="Comissão a Pagar"
          value={formatCurrency(totals.commission)}
          subtitle={selectedBarber ? `Taxa: ${selectedBarber.commission_rate || 50}%` : "Soma das comissões"}
          icon={Wallet}
          variant="warning"
        />
        <RevenueCard
          title="Lucro da Barbearia"
          value={formatCurrency(totals.profit)}
          subtitle="Valor líquido"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Commission Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Detalhamento de Comissões</h3>
        <CommissionTable appointments={appointments} isLoading={isLoading} />
      </div>
    </div>
  );
}
