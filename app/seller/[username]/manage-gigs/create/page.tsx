"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { CreateForm } from "./_components/create_form";
import { api } from "@/convex/_generated/api";

interface CreateGigProps {
  params: {
    username: string;
  };
}

const CreateGig = ({ params }: CreateGigProps) => {
  const insertSubcategories = useMutation(api.seedSubcategories.create);
  useEffect(() => {
    insertSubcategories({});
  });

  return (
    <div className="flex justify-center p-24">
      <CreateForm username={params.username} />
    </div>
  );
};

export default CreateGig;
