import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CashFlowTab } from "@/components/financeiro/CashFlowTab";
import { CommissionReportTab } from "@/components/financeiro/CommissionReportTab";
import { DollarSign, FileText } from "lucide-react";

export default function Financeiro() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Financeiro</h1>
          <p className="mt-1 text-muted-foreground">Controle de caixa e comissões</p>
        </div>

        <Tabs defaultValue="cash-flow" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="cash-flow" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Fluxo de Caixa
            </TabsTrigger>
            <TabsTrigger value="commission" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatório de Comissões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cash-flow" className="mt-6">
            <CashFlowTab />
          </TabsContent>

          <TabsContent value="commission" className="mt-6">
            <CommissionReportTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
