import Link from "next/link";
import { IoLanguageOutline } from "react-icons/io5";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-medium">
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <IoLanguageOutline className="size-4" />
      </div>
      lingocaps.com
    </Link>
  );
}
