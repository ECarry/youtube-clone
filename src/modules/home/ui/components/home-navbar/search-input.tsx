"use client";

import { useRouter } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const [value, setValue] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const url = new URL("/search", process.env.NEXT_PUBLIC_API_URL);
    const newQuery = value.trim();

    url.searchParams.set("query", encodeURIComponent(newQuery));

    if (categoryId) {
      url.searchParams.set("categoryId", categoryId);
    }

    if (newQuery === "") {
      url.searchParams.delete("query");
    }

    setValue(newQuery);
    router.push(url.toString());
  };
  return (
    <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setValue("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-5 py-2.5 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
