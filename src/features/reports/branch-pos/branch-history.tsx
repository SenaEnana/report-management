import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { branchHistoryApi } from "@/services/BranchService";

function BranchHistory() {
  const [branchHistory, setBranchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const { data } = await branchHistoryApi(0, 10, ""); //
        setBranchHistory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, []);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = localStorage.getItem("BranchHistoryUrl");
    if (url) setReportUrl(url);
  }, []);

  if (!reportUrl) {
    return <p>No data available.</p>;
  }
  return (
    <main className="flex-1 flex flex-col p-6 space-y-10">
      <Card className="p-2">
        <div className="relative overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Branches Transaction History 
            </CardTitle>
          </CardHeader>
            <Button className="bg-amber-500 float-end m-2"
            onClick={() => {
              const link = document.createElement("a");
              link.href = reportUrl;
              link.setAttribute("download", "branch_transaction_history_2025-10-29.xlsx");
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          {loading ? (
            <p className="text-center py-4 text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">{error}</p>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-6">
                    Terminal ID
                  </th>
                  {/* <th scope="col" className="px-6 py-6">
                    Merchant Name
                  </th> */}
                  <th scope="col" className="px-6 py-6">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-6">
                    District
                  </th>
                  {/* <th scope="col" className="px-6 py-6">
                    Local Txns
                  </th>    */}
                  <th scope="col" className="px-6 py-6">
                    Cash Advance Amount
                  </th>    
                  {/* <th scope="col" className="px-6 py-6">
                    VISA Txns
                  </th>                                                       */}
                  <th scope="col" className="px-6 py-6">
                    VISA Amount $
                  </th>  
                  {/* <th scope="col" className="px-6 py-6">
                    MC Txns
                  </th> */}
                  <th scope="col" className="px-6 py-6">
                    MC Amount $
                  </th> 
                  {/* <th scope="col" className="px-6 py-6">
                    CUP Txns
                  </th>                                                         */}
                  <th scope="col" className="px-6 py-6">
                    CUP Amount $
                  </th>
                  {/* <th scope="col" className="px-6 py-6">
                   Total Txns
                  </th>  */}
                  <th scope="col" className="px-6 py-6">
                   Total Amount
                  </th> 
                  {/* <th scope="col" className="px-6 py-6">
                  Transaction Date
                  </th>  */}
                </tr>
              </thead>
              <tbody>
                {branchHistory.map((b, i) => (
                  <tr
                    key={i}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                  >
                    <th
                      scope="row"
                      className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {b.terminal_id || "-"}
                    </th>
                    {/* <td className="px-6 py-6">{b.terminal_name || "-"}</td> */}
                    <td className="px-6 py-6">{b.branch || "-"}</td>
                    <td className="px-6 py-6">{b.district || "-"}</td>
                    {/* <td className="px-6 py-6">{b.cash_advance || "-"}</td>    */}
                    <td className="px-6 py-6">{b.cash_advance_amount || "-"}</td>                   
                    {/* <td className="px-6 py-6">{b.visa_txn || "-"}</td>    */}
                    <td className="px-6 py-6">{b.visa_amount || "-"}</td>
                    {/* <td className="px-6 py-6">{b.mc_txn || "-"}</td>  */}
                    <td className="px-6 py-6">{b.mc_amount || "-"}</td>
                    {/* <td className="px-6 py-6">{b.cup_txn || "-"}</td> */}
                    <td className="px-6 py-6">{b.cup_amount || "-"}</td>    
                    {/* <td className="px-6 py-6">{b.total_txn || "-"}</td>   */}
                    <td className="px-6 py-6">{b.total_amount || "-"}</td>
                    {/* <td className="px-6 py-6">{b.transaction_date || "-"}</td>   */}
                             
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </main>
  );
}

export default BranchHistory;
