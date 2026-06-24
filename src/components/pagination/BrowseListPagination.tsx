import { getRouteApi } from "@tanstack/react-router";
import ResponsivePagination from "react-responsive-pagination";

const browseRouteApi = getRouteApi("/_app/movies/");

interface BrowseListPaginationProps {
  totalPages: number;
}

export function BrowseListPagination({ totalPages }: BrowseListPaginationProps) {
  const browseSearch = browseRouteApi.useSearch();
  const navigate = browseRouteApi.useNavigate();

  if (totalPages <= 1) return null;

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-full items-center justify-center overflow-hidden px-1 py-2 sm:max-w-[70%]">
      <ResponsivePagination
        current={browseSearch.page}
        total={totalPages}
        onPageChange={(page) => {
          void navigate({
            search: {
              ...browseSearch,
              page,
            },
          });
        }}
      />
    </div>
  );
}
