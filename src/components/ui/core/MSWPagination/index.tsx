import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../button';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const MSWPagination = ({ totalPage }: { totalPage: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize currentPage from URL ?page= param or default to 1
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync currentPage if URL changes externally
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get('page')) || 1;
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  const updatePage = (page: number) => {
    // Preserve other query params and update 'page'
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    router.push(`${pathname}?${params.toString()}`);
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      updatePage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      updatePage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-end items-center my-10 gap-2">
      <Button
        onClick={handlePrev}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="w-8 h-8 rounded-full flex justify-center items-center"
      >
        <ArrowLeft />
      </Button>
      {[...Array(totalPage)].map((_, index) => {
        const pageNum = index + 1;
        const isActive = currentPage === pageNum;

        return (
          <Button
            key={pageNum}
            onClick={() => updatePage(pageNum)}
            size="sm"
            className={`w-8 h-8 rounded-full flex justify-center items-center transition-colors ${
              isActive
                ? 'bg-[#003250] text-white hover:bg-[#003250]'
                : 'bg-white text-gray-700 border hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </Button>
        );
      })}
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPage}
        variant="outline"
        size="sm"
        className="w-8 h-8 rounded-full flex justify-center items-center"
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export default MSWPagination;
