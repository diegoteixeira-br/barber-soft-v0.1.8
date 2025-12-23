import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinancialAppointment, calculateCommission, calculateProfit } from "@/hooks/useFinancialData";
import { Skeleton } from "@/components/ui/skeleton";

interface CommissionTableProps {
  appointments: FinancialAppointment[];
  isLoading: boolean;
}

export function CommissionTable({ appointments, isLoading }: CommissionTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totals = appointments.reduce(
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>Nenhum atendimento encontrado para o período e barbeiro selecionados.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Data</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-center">Comissão (%)</TableHead>
            <TableHead className="text-right">Valor Comissão</TableHead>
            <TableHead className="text-right">Lucro Barbearia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const commissionRate = appointment.barber?.commission_rate ?? 50;
            const commissionValue = calculateCommission(appointment.total_price, commissionRate);
            const profitValue = calculateProfit(appointment.total_price, commissionRate);

            return (
              <TableRow key={appointment.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  {format(new Date(appointment.start_time), "dd/MM", { locale: ptBR })}
                </TableCell>
                <TableCell>{appointment.service?.name || "-"}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(appointment.total_price)}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {commissionRate}%
                </TableCell>
                <TableCell className="text-right text-primary font-medium">
                  {formatCurrency(commissionValue)}
                </TableCell>
                <TableCell className="text-right text-emerald-500 font-medium">
                  {formatCurrency(profitValue)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter className="bg-muted/80">
          <TableRow>
            <TableCell colSpan={2} className="font-bold">TOTAL</TableCell>
            <TableCell className="text-right font-bold">
              {formatCurrency(totals.total)}
            </TableCell>
            <TableCell />
            <TableCell className="text-right font-bold text-primary">
              {formatCurrency(totals.commission)}
            </TableCell>
            <TableCell className="text-right font-bold text-emerald-500">
              {formatCurrency(totals.profit)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
