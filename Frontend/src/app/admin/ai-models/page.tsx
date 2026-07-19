import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const models = [
  { name: "Disease Detection (YOLOv11)", accuracy: "92%", status: "Live" },
  { name: "Price Prediction (LSTM)", accuracy: "88%", status: "Live" },
  { name: "Fertilizer Recommendation", accuracy: "85%", status: "Live" },
  { name: "Chatbot (LangChain + RAG)", accuracy: "—", status: "Beta" },
];

export default function AdminAiModelsPage() {
  return (
    <>
      <PageHeader title="AI Models" description="Monitor the health of every model in production." />
      <div className="grid gap-4 sm:grid-cols-2">
        {models.map((m) => (
          <Card key={m.name} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark">{m.name}</p>
              <p className="text-xs text-dark/50">Accuracy: {m.accuracy}</p>
            </div>
            <Badge tone={m.status === "Live" ? "primary" : "accent"}>{m.status}</Badge>
          </Card>
        ))}
      </div>
    </>
  );
}
