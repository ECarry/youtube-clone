"use client";

import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export const StudioUploadModal = () => {
  return (
    <Button variant="secondary" className="flex items-center gap-1">
      <PlusIcon />
      Create
    </Button>
  );
};
