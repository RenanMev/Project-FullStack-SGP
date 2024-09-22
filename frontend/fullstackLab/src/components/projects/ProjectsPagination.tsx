import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface ProjectsPaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function ProjectsPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: ProjectsPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const range = 2
  let start = Math.max(currentPage - Math.floor(range / 2), 1)
  let end = start + range - 1

  if (end > totalPages) {
    end = totalPages
    start = Math.max(end - range + 1, 1)
  }

  return (
    <Pagination className='mt-4'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => onPageChange(currentPage - 1)}
          />
        </PaginationItem>
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            {start > 2 && <PaginationEllipsis />}
          </>
        )}
        {[...Array(end - start + 1)].map((_, index) => (
          <PaginationItem key={start + index}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(start + index)}
              className={currentPage === start + index ? 'bg-primary text-primary-foreground' : ''}
            >
              {start + index}
            </PaginationLink>
          </PaginationItem>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink href="#" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => onPageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}