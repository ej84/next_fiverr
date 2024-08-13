import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Clock, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useAction } from "convex/react";

interface ContentEditorProps {
  offer?: Doc<"offers">;
  gigId: Id<"gigs">;
  tier: "Basic" | "Standard" | "Premium";
}

export const ContentEditor = ({ offer, gigId, tier }: ContentEditorProps) => {
  const [title, setTitle] = useState<string>(offer?.title || "");
  const [description, setDescription] = useState<string>(
    offer?.description || ""
  );
  const [price, setPrice] = useState<number>(offer?.price || 5);
  const [revisions, setRevisions] = useState<number>(offer?.revisions || 1);
  const [deliveryDays, setDeliveryDays] = useState<number>(
    offer?.delivery_days || 2
  );
  const addOfffer = useAction(api.offers.add);

  const handleSave = async () => {
    try {
      await addOfffer({
        gigId,
        title,
        description,
        tier,
        price,
        delivery_days: deliveryDays,
        revisions,
      });
      toast.success("Offer saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save offer");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title:</Label>
        <Input />
      </div>
    </div>
  );
};
