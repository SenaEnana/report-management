import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { branchHistoryApi, downloadAllBranchHistoryApi } from "@/services/BranchService";
import { Input } from "@/components/ui/input";

function BranchHistory() {
  const [branchHistory, setBranchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terminalCode, setTerminalCode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(""); 
  const [reportUrl, setReportUrl] = useState<string | null>(null);    

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const { data } = await branchHistoryApi(0, 10, ""); //
        setBranchHistory(data);
          const url = localStorage.getItem("BranchHistoryUrl");
          if (url) setReportUrl(url);  
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, []);

const handleDownloadByDate = async () => {
  if (!terminalCode || !fromDate || !toDate) {
    alert("Please fill terminal code, from date, and to date");
    return;
  }
  try {
    const url = `http://172.24.111.254:5000/api/export/branch-history/date?terminal_code=${terminalCode}&from=${fromDate}&to=${toDate}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `merchant_history_${terminalCode}_${fromDate}_to_${toDate}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
    alert("Error downloading merchant history. Check console for details.");
  }
};

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
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <Input
              placeholder="Terminal Code"
              value={terminalCode}
              onChange={(e) => setTerminalCode(e.target.value)}
              className="w-[180px]"
            />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <Button className="bg-amber-500" onClick={handleDownloadByDate}>
              <Download className="mr-2 h-4 w-4" /> Download by Date
            </Button>
          </div>
            <Button
              className="bg-gray-500 float-end m-2"
              onClick={() => { downloadAllBranchHistoryApi()
              }}
            >
              <Download className="mr-2 h-4 w-4" /> Download All
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
