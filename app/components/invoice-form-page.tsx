/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { InvoiceData, InvoiceDocument, InvoiceLine } from "./invoice-document";

const emptyLine: InvoiceLine = { appliance: "", quantity: 1, unitPrice: 0 };

const defaultData: InvoiceData = {
  customerName: "",
  customerNameAr: "",
  phone: "",
  phoneAr: "",
  city: "",
  cityAr: "",
  clientId: "",
  clientIdAr: "",
  warrantyStart: "",
  warrantyEnd: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  lines: [],
};

const parseNumber = (value: string, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(value);

export function InvoiceFormPage() {
  const [form, setForm] = useState<InvoiceData>(defaultData);
  const [draftLine, setDraftLine] = useState<InvoiceLine>(emptyLine);
  const [submitted, setSubmitted] = useState<InvoiceData | null>(null);

  const totalAmount = useMemo(
    () => form.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [form.lines],
  );

  const setField = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addLine = () => {
    const trimmed = draftLine.appliance.trim();
    if (!trimmed) return;

    setForm((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          appliance: trimmed,
          quantity: Math.max(0, draftLine.quantity),
          unitPrice: Math.max(0, draftLine.unitPrice),
        },
      ],
    }));
    setDraftLine(emptyLine);
  };

  const removeLine = (index: number) => {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 print:hidden">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#be1e2d] rounded flex items-center justify-center text-white font-bold text-xl">I</div>
            <h1 className="text-lg font-bold tracking-tight">Invoice Manager</h1>
          </div>
          <button
            type="button"
            className="rounded-lg bg-[#be1e2d] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-100 hover:bg-[#a01926] transition-all active:scale-95"
            onClick={() => setSubmitted(form)}
          >
            Preview Invoice
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Customer Info Card */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-neutral-50/50">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Client Details / معلومات الزبون</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { id: "customerName", idAr: "customerNameAr", label: "Full Name", labelAr: "الاسم الكامل", placeholder: "Nom" },
                  { id: "phone", idAr: "phoneAr", label: "Phone Number", labelAr: "رقم الهاتف", placeholder: "N° Tél" },
                  { id: "city", idAr: "cityAr", label: "City", labelAr: "المدينة", placeholder: "Ville" },
                  { id: "clientId", idAr: "clientIdAr", label: "Client ID", labelAr: "معرف الزبون", placeholder: "ID du client" },
                ].map((field) => (
                  <div key={field.id} className="contents">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase">{field.label}</label>
                      <input 
                        className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-[#be1e2d] outline-none transition-all"
                        placeholder={field.placeholder} 
                        value={(form as any)[field.id]} 
                        onChange={(e) => setField(field.id as any, e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1 text-right">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase">{field.labelAr}</label>
                      <input 
                        dir="rtl"
                        className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-[#be1e2d] outline-none transition-all"
                        placeholder={field.labelAr} 
                        value={(form as any)[field.idAr]} 
                        onChange={(e) => setField(field.idAr as any, e.target.value)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-neutral-50/50">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Invoice Items / الأجهزة</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_auto] gap-3 mb-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-400 uppercase">Appareil</label>
                    <input
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-[#be1e2d] outline-none"
                      placeholder="Description"
                      value={draftLine.appliance}
                      onChange={(e) => setDraftLine((prev) => ({ ...prev, appliance: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-400 uppercase">Qté</label>
                    <input
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm"
                      type="number"
                      min={0}
                      value={draftLine.quantity}
                      onChange={(e) => setDraftLine((prev) => ({ ...prev, quantity: parseNumber(e.target.value, 0) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-400 uppercase">Prix (MAD)</label>
                    <input
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm"
                      type="number"
                      min={0}
                      step="0.01"
                      value={draftLine.unitPrice}
                      onChange={(e) => setDraftLine((prev) => ({ ...prev, unitPrice: parseNumber(e.target.value, 0) }))}
                    />
                  </div>
                  <div className="pt-4.75">
                    <button 
                      className="h-10.5 px-6 rounded-lg bg-neutral-900 text-white font-bold text-sm hover:bg-black transition-colors" 
                      type="button" 
                      onClick={addLine}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-neutral-100">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Appareil</th>
                        <th className="px-4 py-3 text-center font-semibold">Qté</th>
                        <th className="px-4 py-3 text-right font-semibold">Prix Unit.</th>
                        <th className="px-4 py-3 text-right font-semibold">Total</th>
                        <th className="px-4 py-3 text-center font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {form.lines.length === 0 ? (
                        <tr>
                          <td className="px-4 py-8 text-center text-neutral-400 italic" colSpan={5}>
                            Aucun appareil ajouté pour le moment
                          </td>
                        </tr>
                      ) : (
                        form.lines.map((line, idx) => (
                          <tr key={`${line.appliance}-${idx}`} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-4 py-3 font-medium">{line.appliance}</td>
                            <td className="px-4 py-3 text-center">{line.quantity}</td>
                            <td className="px-4 py-3 text-right">{formatMoney(line.unitPrice)}</td>
                            <td className="px-4 py-3 text-right font-bold text-neutral-700">{formatMoney(line.quantity * line.unitPrice)}</td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                className="text-neutral-400 hover:text-red-600 transition-colors p-1" 
                                type="button" 
                                onClick={() => removeLine(idx)}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Meta & Logistics */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Logistics</h2>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400 uppercase">Date facture</label>
                  <input 
                    className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm" 
                    type="date" 
                    value={form.invoiceDate} 
                    onChange={(e) => setField("invoiceDate", e.target.value)} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-400 uppercase">Début garantie</label>
                    <input 
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm" 
                      type="date" 
                      value={form.warrantyStart} 
                      onChange={(e) => setField("warrantyStart", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-400 uppercase">Fin garantie</label>
                    <input 
                      className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm" 
                      type="date" 
                      value={form.warrantyEnd} 
                      onChange={(e) => setField("warrantyEnd", e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Articles</span>
                  <span className="font-bold">{form.lines.reduce((sum, line) => sum + line.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-neutral-500 font-medium">Total TTC</span>
                  <span className="text-2xl font-black text-[#be1e2d] tracking-tight">
                    {formatMoney(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Une fois le formulaire rempli, cliquez sur <strong>Preview Invoice</strong> pour générer le document prêt à l&apos;impression.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal / Overlay for Preview */}
      {submitted ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-neutral-900/65 p-2 print:fixed print:inset-0 print:block print:bg-white print:p-0"
          onClick={() => setSubmitted(null)}
        >
          <div
            className="relative my-3 w-full max-w-[220mm] rounded-lg bg-neutral-100 p-1 shadow-lg print:m-0 print:min-h-screen print:w-full print:max-w-none print:rounded-none print:bg-white print:p-0 print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar inside Preview */}
            <div className="z-10 mb-1 flex items-center justify-between gap-2 rounded-t-lg border-b bg-white px-4 py-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                <span className="ml-2 text-sm font-bold text-neutral-400">Invoice Preview</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-bold text-white hover:bg-black"
                  onClick={() => window.print()}
                >
                  Print Document
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-neutral-200 bg-white px-5 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setSubmitted(null)}
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="bg-white p-2">
              <InvoiceDocument data={submitted} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
