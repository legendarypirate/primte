import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteNav } from "@/lib/site-nav";
import { PrimeLogo } from "./primitives";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ffffff15] bg-[#050507] pt-14 pb-8 text-[#a0a0a5]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <PrimeLogo />
            <p className="mt-4 text-xs leading-relaxed text-[#8a8a90]">
              Илүү сайн хүн, Илүү аюулгүй нийгэм.
              <br />
              Практик буудлагын спортоор дамжуулан сахилга бат, хариуцлага, манлайлыг төлөвшүүлнэ.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24]">
              ХОЛБООС
            </p>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {siteNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/training#shop" className="transition-colors hover:text-white">
                  Дэлгүүр
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24]">
              ХОЛБОО БАРИХ
            </p>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-[#e31e24]" />
                <span>8611-0200</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-[#e31e24]" />
                <span>registration@prime.mn</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-[#e31e24]" />
                <span>Улаанбаатар, Монгол Улс</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Motto */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24]">
              FOLLOW US
            </p>
            <div className="flex gap-3 mb-6 text-[10px] font-bold">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white"
              >
                FB
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white"
              >
                IG
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white"
              >
                YT
              </a>
            </div>
            <div className="space-y-0.5 font-mono text-[9px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">
              <p>DISCIPLINE</p>
              <p>SKILL</p>
              <p>A SAFER TOMORROW</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#ffffff10] pt-6 text-[11px] text-muted-foreground sm:flex-row">
          <p>© 2024 PRIME IPSC Club. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-4 text-[10px] font-semibold tracking-widest uppercase">
            <span>IPSC ACTION AIR CLUB</span>
            <span>/</span>
            <span>MONGOLIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
