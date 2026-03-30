"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api-client";
import type { StudentFeeRow, TermFeeItem } from "@/features/students/types";
import { createOrder, getStudentByAdmission } from "@/features/students/services/students.service";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function PaymentPageContent() {
  const router = useRouter();
  const params = useSearchParams();

  const admissionNumber = params.get("admissionNumber") ?? "";
  const academicYear = params.get("academicYear") ?? "";
  const termName = params.get("term") ?? "";
  const currency="INR"

  const [student, setStudent] = useState<StudentFeeRow | null>(null);
  const [fee, setFee] = useState<TermFeeItem | null>(null);
  console.log(fee,"fee1111",student);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!admissionNumber || !academicYear || !termName) {
      setError("Missing payment details. Please go back and try again.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const row = await getStudentByAdmission(admissionNumber, academicYear);
        setStudent(row);
        const termFee = row.termFees[termName];
        if (!termFee) {
          setError(`Term "${termName}" not found for this student.`);
        } else {
          setFee(termFee);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load student details."));
      } finally {
        setLoading(false);
      }
    })();
  }, [admissionNumber, academicYear, termName]);

  const handlePay = async () => {
    const order = await createOrder(fee?.amount ?? 0,admissionNumber,academicYear,termName,currency);
    console.log(order,"order1111");
    const paymentDetails:any = student?.termFees[termName];
    console.log(paymentDetails,"paymentDetails1111");
    const options = {
      // key: "rzp_test_4ooZqGtgtcJpfl",
      // key_secret: "PHqqPRAeJ2AVlkwq0nVIP0rI",
     
      key: 'rzp_test_sqNxwNoHPVS5c0',
      key_secret: 'CUOhlURnP5abO40zUFZ30mOB',

      // key: 'rzp_live_zdLen5i4S2GX08',
      // key_secret: 'ek6dSNO2VvHbKpuikxKYK70a',

      // key: razorpayKey,
      // key_secret: razorpaySecret,

      amount: ((paymentDetails.discountedAmount && paymentDetails.discountedAmount !== "NA" && paymentDetails.discountedAmount !== "Pending" && paymentDetails.discountedAmount !== "Rejected") ? paymentDetails.discountedAmount : paymentDetails.amount) * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      order_id: paymentDetails.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      currency: "INR",
      name: "SVBK",
      // description: termName,
      handler: function (response:any) { 
          console.log("success response of handler in razorpay",response)
          // setShouldNavigate(true)
          // dispatch(apiUpdateOrderDetails({
          //     signature: response.razorpay_signature,
          //     ADMISSION: payeeDetails.admissionNumber,
          //     receipt: payeeDetails.receipt,
          //     paymentStatus: "Paid",
          //     transactionId: response.razorpay_payment_id,
          //     orderId: theArray.orderId,
          //     paidAmount: ((theArray.discountedAmount && theArray.discountedAmount !== "NA" && theArray.discountedAmount !== "Pending" && theArray.discountedAmount !== "Rejected") ? theArray.discountedAmount : theArray.amount)
          // }))

          // dispatch(apiSaveAuditLogs({
          //     orderId: response.razorpay_order_id,
          //     transactionId: response.razorpay_payment_id,
          //     name: payeeDetails.name,
          //     email: payeeDetails.email,
          //     admissionNumber: payeeDetails.admissionNumber,
          //     term: payeeDetails.receipt,
          //     branch:adminDetails?.data?.branch
          // }))
          
      },
      modal: {
          "ondismiss": function () {
              // navigate("/admission")
              // dispatch(resetCreateOrderState())
              // dispatch(resetGetStudentDetailsByAdmissionDetailsState())
          }
      },
      prefill: {
          // name: redirectPage !== "native"? "":payeeDetails.name,
          // email: redirectPage !== "native"? "":payeeDetails.email,
          // contact: redirectPage !== "native"? "":payeeDetails.phoneNumber,
      },
      // timeout: 480,
      // retry:{
      //     enabled: false
      // }
  };
  const _window:any = window;
  const paymentObject:any = new _window.Razorpay(options);
  paymentObject.open();



    // setPaying(true);
    // // TODO: call payment API
    // await new Promise((r) => setTimeout(r, 1500));
    // setPaying(false);
    // setSuccess(true);
  };

  const total = fee ? fee.amount + fee.penaltyAmount : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg" style={{ backgroundColor: "var(--app-divider)" }} />
        <div className="animate-pulse rounded-xl border p-6" style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}>
          <div className="mb-4 h-5 w-1/3 rounded" style={{ backgroundColor: "var(--app-divider)" }} />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 rounded" style={{ backgroundColor: "var(--app-divider)", width: `${60 + i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push("/pay-now")}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--app-brand)" }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pay Now
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "var(--app-success-bg)" }}>
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ color: "var(--app-success)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold" style={{ color: "var(--app-text-primary)" }}>Payment Successful!</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--app-text-secondary)" }}>
          {formatCurrency(total)} paid for {termName}
        </p>
        <button
          type="button"
          onClick={() => router.push("/pay-now")}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl px-6 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--app-brand)" }}
        >
          Back to Pay Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: "var(--app-brand)" }}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-semibold" style={{ color: "var(--app-text-primary)" }}>
        Payment — {termName}
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: details */}
        <div className="flex-1 space-y-5">
          {/* Student info */}
          {student && (
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
                Student Details
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {[
                  { label: "Name", value: student.name },
                  { label: "Admission No", value: student.admissionNumber },
                  { label: "Class", value: student.class },
                  { label: "Section", value: student.section },
                  { label: "Roll No", value: student.rollNo },
                  { label: "Phone", value: student.phone },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: "var(--app-text-primary)" }}>{value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fee breakup table */}
          {fee && (
            <div
              className="overflow-hidden rounded-xl border"
              style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
            >
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--app-divider)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--app-text-primary)" }}>
                  Fee Breakup — {termName}
                </p>
              </div>
              <table className="w-full">
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--app-divider)" }}>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--app-text-secondary)" }}>Term Fee</td>
                    <td className="px-5 py-3 text-right text-sm font-medium" style={{ color: "var(--app-text-primary)" }}>
                      {formatCurrency(fee.amount)}
                    </td>
                  </tr>
                  {/* <tr style={{ borderBottom: "1px solid var(--app-divider)" }}>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--app-text-secondary)" }}>Penalty Amount</td>
                    <td className="px-5 py-3 text-right text-sm font-medium" style={{ color: fee.penaltyAmount > 0 ? "var(--app-danger)" : "var(--app-text-primary)" }}>
                      {formatCurrency(fee.penaltyAmount)}
                    </td>
                  </tr> */}
                  {fee.paidAmount > 0 && (
                    <tr style={{ borderBottom: "1px solid var(--app-divider)" }}>
                      <td className="px-5 py-3 text-sm" style={{ color: "var(--app-text-secondary)" }}>Already Paid</td>
                      <td className="px-5 py-3 text-right text-sm font-medium" style={{ color: "var(--app-success)" }}>
                        − {formatCurrency(fee.paidAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: "var(--app-search-bg)" }}>
                    <td className="px-5 py-4 text-sm font-semibold" style={{ color: "var(--app-text-primary)" }}>
                      Total Payable
                    </td>
                    <td className="px-5 py-4 text-right text-lg font-bold" style={{ color: "var(--app-brand)" }}>
                      {formatCurrency(fee.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Right: payment summary + pay button */}
        <div className="w-full lg:w-[340px]">
          <div
            className="sticky top-6 space-y-4 rounded-xl border p-5"
            style={{ backgroundColor: "var(--app-card-bg)", borderColor: "var(--app-divider)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Payment Summary
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--app-text-secondary)" }}>Term</span>
                <span className="font-medium" style={{ color: "var(--app-text-primary)" }}>{termName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--app-text-secondary)" }}>Fee</span>
                <span className="font-medium" style={{ color: "var(--app-text-primary)" }}>{fee ? formatCurrency(fee.amount) : "—"}</span>
              </div>
              {/* {fee && fee.penaltyAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--app-text-secondary)" }}>Penalty</span>
                  <span className="font-medium" style={{ color: "var(--app-danger)" }}>{formatCurrency(fee.penaltyAmount)}</span>
                </div>
              )} */}
              {fee && fee.paidAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--app-text-secondary)" }}>Already Paid</span>
                  <span className="font-medium" style={{ color: "var(--app-success)" }}>− {formatCurrency(fee.paidAmount)}</span>
                </div>
              )}
              <div className="border-t pt-2" style={{ borderColor: "var(--app-divider)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "var(--app-text-primary)" }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: "var(--app-brand)" }}>
                    {fee ? formatCurrency(fee.amount) : "—"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--app-brand)" }}
            >
              {paying ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pay {fee ? formatCurrency(fee.amount) : ""}
                </>
              )}
            </button>

            <p className="text-center text-[10px]" style={{ color: "var(--app-text-secondary)" }}>
              By clicking Pay, you confirm the payment details are correct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
