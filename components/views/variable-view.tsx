import { Label } from "../ui/label";

export default function VariableView() {
    return (
        <div className="space-y-2 bg-slate-200 p-2 rounded">
            <Label>
                Variable Instruction
            </Label>
            <p className="text-xs text-gray-800">
                Use variables ,if needed, to personalize the email content:
            </p>
            <p className="text-xs text-gray-800">
                - Customer name: <code className="rounded bg-muted px-1 py-0.5">{"{{customer}}"}</code>.
            </p>
            <p className="text-xs text-gray-800">
                - Shipment number: <code className="rounded bg-muted px-1 py-0.5">{"{{shipmentnumber}}"}</code>.
            </p>
        </div>
    );
}