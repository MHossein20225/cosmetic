import { NavLinkProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinkItem({ link, onClickFn }: NavLinkProps) {
  const pathName = usePathname();
  return (
    <Link
      href={link.href}
      className={`text-xs font-medium uppercase tracking-wider transition-colors ${
        link.href === pathName
          ? "text-amber-800"
          : "text-gray-700 hover:text-amber-800"
      }`}
      onClick={onClickFn}
    >
      {link.label}
    </Link>
  );
}
