import Image from "next/image";
import { MapPin } from "lucide-react";

export type InvoiceLine = {
  appliance: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceData = {
  customerName: string;
  customerNameAr: string;
  phone: string;
  phoneAr: string;
  city: string;
  cityAr: string;
  clientId: string;
  clientIdAr: string;
  warrantyStart: string;
  warrantyEnd: string;
  invoiceDate: string;
  lines: InvoiceLine[];
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(value);

const BrandHeader = () => {
  return (
    <div className="w-full font-sans text-[#222]">
      <div className="grid grid-cols-[1.6fr_1fr_auto] items-center gap-4 rounded-full border border-gray-300 bg-gray-100 px-3 py-2 text-[11px] font-medium text-gray-700 print:grid-cols-[2.1fr_1fr_auto] print:items-start">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin size={14} className="text-gray-600" />
          <span className="truncate print:overflow-visible print:whitespace-normal">
            Av. Mohammed V - à côté du Complexe Culturel, Selouane, Nador
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <div className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-500 bg-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </div>
          <div className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-500 bg-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </div>
          <div className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-500 bg-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-label="TikTok">
              <path d="M19.6 7.9a5.9 5.9 0 0 1-3.8-1.4v6.8a5.3 5.3 0 1 1-4.6-5.3v2.7a2.7 2.7 0 1 0 2 2.6V2h2.6c.2 1.8 1.6 3.2 3.4 3.4v2.5h.4Z" />
            </svg>
          </div>
          <span className="ml-1 font-bold whitespace-nowrap">electrobouziani</span>
        </div>

        <div className="flex items-center gap-1.5 whitespace-nowrap font-bold">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="WhatsApp"
          >
            <path
              d="M20.52 3.48A11.88 11.88 0 0 0 12.06 0C5.48 0 .11 5.37.11 11.95c0 2.1.55 4.15 1.59 5.95L0 24l6.26-1.64a11.87 11.87 0 0 0 5.8 1.48h.01c6.58 0 11.94-5.37 11.94-11.95 0-3.19-1.24-6.19-3.49-8.41Z"
              fill="#25D366"
            />
            <path
              d="M12.08 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.22-3.71.97.99-3.62-.24-.37a9.85 9.85 0 0 1-1.52-5.24C2.2 6.51 6.62 2.1 12.07 2.1c2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.9 6.95c0 5.43-4.43 9.85-9.87 9.85Z"
              fill="#FFF"
            />
            <path
              d="M17.54 14.24c-.3-.15-1.76-.87-2.04-.97-.27-.1-.46-.15-.66.15-.2.3-.75.97-.92 1.16-.17.2-.35.22-.65.08-.3-.15-1.29-.47-2.45-1.5-.91-.81-1.52-1.8-1.7-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.66-1.6-.9-2.2-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.08-.8.38-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.11 3.2 5.12 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.08-.12-.28-.2-.58-.35Z"
              fill="#25D366"
            />
          </svg>
          <span>+212 627 92 82 74</span>
        </div>
      </div>
    </div>
  );
};

type InvoiceDocumentProps = {
  data: InvoiceData;
  minRows?: number;
};

export function InvoiceDocument({ data, minRows = 5 }: InvoiceDocumentProps) {
  const totalAmount = data.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const totalQuantity = data.lines.reduce((sum, line) => sum + line.quantity, 0);
  const extraRows = Math.max(minRows - Math.max(data.lines.length, 1), 0);

  return (
    <main
      id="invoice-page"
      className="mx-auto w-[210mm] min-h-[287mm] border border-neutral-300 bg-white px-[12mm] py-0 text-neutral-900 shadow-sm print:min-h-[281mm] print:border-0 print:shadow-none"
    >
      <div className="mb-[3mm] w-full border-b-2 border-black pb-[2mm]">
        <Image
          src="/header.png"
          alt="Electro Bouziani header"
          width={1400}
          height={360}
          priority
          className="block max-h-[36mm] w-full object-contain"
        />
      </div>

      <BrandHeader />

      <div className="mb-[2mm] mt-[3mm] grid grid-cols-[1fr_auto] items-end gap-2">
        <h1 className="m-0 text-[15pt] font-bold tracking-[1.5px] text-[#be1e2d]">FACTURE / BON DE GARANTIE</h1>
        <span className="text-[10pt] font-semibold">Date: {data.invoiceDate || "-"}</span>
      </div>

      <section className="mb-[4mm] mt-[3mm] grid grid-cols-2 gap-x-[10mm] gap-y-[4mm] text-[10.2pt]">
        {[
          ["Nom :", data.customerName],
          ["الاسم\u200F:", data.customerNameAr],
          ["N° Tél :", data.phone],
          ["رقم الهاتف\u200F:", data.phoneAr],
          ["Ville :", data.city],
          ["المدينة\u200F:", data.cityAr],
          ["ID du client :", data.clientId],
          ["معرف الزبون\u200F:", data.clientIdAr],
          ["Période de garantie :", `${data.warrantyStart || "__ / __ / ____"} au ${data.warrantyEnd || "__ / __ / ____"}`],
          ["مدة الضمان\u200F:", `من ${data.warrantyStart || "__ / __ / ____"} إلى ${data.warrantyEnd || "__ / __ / ____"}`],
        ].map(([label, value], idx) => {
          const isArabic = /[\u0600-\u06FF]/.test(label);
          return (
            <div
              key={`${label}-${idx}`}
              className={`flex items-baseline gap-[2mm] ${isArabic ? "direction-rtl" : ""}`}
              dir={isArabic ? "rtl" : "ltr"}
            >
              <span className="font-bold">{label}</span>
              <span className={`min-h-[4.7mm] flex-1 ${value ? "" : "border-b border-dotted border-neutral-500"}`}>
                {value || ""}
              </span>
            </div>
          );
        })}
      </section>

      <table className="invoice-lines-table mt-[4mm] w-full table-fixed border-collapse border border-neutral-800 text-[10pt]">
        <thead>
          <tr className="bg-[#be1e2d] text-center font-bold text-white">
            <th className="w-[55%] border border-neutral-800 px-[2.2mm] py-[1.8mm]">Appareil</th>
            <th className="w-[15%] border border-neutral-800 px-[2.2mm] py-[1.8mm]">Quantité</th>
            <th className="w-[15%] border border-neutral-800 px-[2.2mm] py-[1.8mm]">Prix unitaire</th>
            <th className="w-[15%] border border-neutral-800 px-[2.2mm] py-[1.8mm]">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.lines.length === 0 ? (
            <tr>
              <td className="h-[9.5mm] border border-neutral-800 px-[2.2mm] py-[1.8mm]"></td>
              <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm] text-center"></td>
              <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm] text-right"></td>
              <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm] text-right"></td>
            </tr>
          ) : (
            data.lines.map((line, idx) => {
              const lineTotal = line.quantity * line.unitPrice;
              const isRowBeforeTotal = idx === data.lines.length - 1 && extraRows === 0;
              return (
                <tr
                  key={`${line.appliance}-${idx}`}
                  className={`break-inside-avoid-page ${isRowBeforeTotal ? "invoice-row-before-total" : ""}`}
                >
                  <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm] align-top">{line.appliance || "-"}</td>
                  <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm] text-center align-top">{line.quantity}</td>
                  <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm] text-right align-top">{formatMoney(line.unitPrice)}</td>
                  <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm] text-right align-top">{formatMoney(lineTotal)}</td>
                </tr>
              );
            })
          )}

          {Array.from({ length: extraRows }).map((_, idx) => (
            <tr
              key={`empty-${idx}`}
              className={`break-inside-avoid-page ${idx === extraRows - 1 ? "invoice-row-before-total" : ""}`}
            >
              <td className="h-[9.5mm] border border-neutral-800 px-[2.2mm] py-[1.8mm]" />
              <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm]" />
              <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm]" />
              <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm]" />
            </tr>
          ))}

        </tbody>
        <tfoot>
          <tr className="bg-[#be1e2d] text-center font-bold text-white">
            <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm]">Total</td>
            <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm]">{totalQuantity}</td>
            <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm]"> - </td>
            <td className="border border-neutral-800 px-[2.2mm] py-[1.8mm]">{formatMoney(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-[5mm] border border-neutral-800 bg-[#be1e2d] px-[3mm] py-[2mm] text-center text-[10pt] font-bold text-white">
        Conditions de garantie : شروط الضمان
      </div>
      <div className="border border-t-0 border-neutral-800 px-[3mm] py-[2.5mm] text-[9.3pt]">
        <p className="mb-[1.5mm]">
          La garantie couvre les pannes techniques résultant d&apos;une utilisation normale de l&apos;appareil, et ne couvre pas la
          casse, les chutes, l&apos;incendie, la mauvaise utilisation, les surtensions électrique ou toute intervention extérieure.
        </p>
        <p className="mb-0 text-right" dir="rtl">
          يغطي الضمان الأعطال الفنية الناتجة عن الاستخدام العادي للجهاز، ولا يغطي الكسر، أو السقوط، أو الحريق، أو سوء الاستخدام، أو
          ارتفاع مفاجئ في التيار الكهربائي، أو أو أي تدخل خارجي.
        </p>
      </div>

      <div className="mt-[15mm] grid grid-cols-2 items-end">
        <div className="text-[11pt] font-bold">
          Signature : <span className="inline-block w-[65mm] -translate-y-0.5 border-b border-neutral-700" />
        </div>
      </div>
    </main>
  );
}
