import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { branchHistoryApi, downloadAllBranchHistoryApi } from "@/services/BranchService";
import { useForm, FormProvider } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function BranchHistory() {
  const [branchHistory, setBranchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terminalCode, setTerminalCode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(""); 
  const [from, setFrom] = useState("");
  const [to, setTo] = useState(""); 
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

  const methods = useForm({
    defaultValues: {
        terminalCode: "",
        fromDate: "",
        toDate: "",
        from: "",
        to: "",
      },
    });  

const handleDownloadByTerminal = async () => {
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

  const handleDownloadByDate = async () => {
  if (!from || !to) {
    alert("Please fill start date, and end date");
    return;
  }
  try {
    const url = `http://172.24.111.254:5000/api/export/all-merchant-history-date?from=${from}&to=${to}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `merchant_history_${from}_to_${to}.xlsx`
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
          <FormProvider {...methods}>
          <div className="flex items-center gap-2 rounded-lg">
            <FormField
              name="terminalCode"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>Terminal Code</FormLabel>
                  <Input
                    type="text"
                    value={terminalCode}
                    placeholder="Enter Terminal Code"
                    onChange={(e) => setTerminalCode(e.target.value)}
                  />
                </FormItem>
              )}
            />  
            <FormField
              name="fromDate"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </FormItem>
              )}
            />                      
            <FormField
              name="toDate"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </FormItem>
              )}
            />
            <Button className="bg-amber-500" onClick={handleDownloadByTerminal}>
              <Download className="mr-1 h-2 w-2" /> Download by Date
            </Button>
          </div>
        <div className="flex items-center gap-2 p-4 rounded-lg mb-1">         
            <FormField
              name="from"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </FormItem>
              )}
            />              
            <FormField
              name="to"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </FormItem>
              )}
            />
            <Button className="bg-amber-500" onClick={handleDownloadByDate}>
              <Download className="mr-2 h-4 w-4" /> Download by Date
            </Button>
          </div>    
          </FormProvider>      
            <Button
              className="bg-amber-500 float-end m-2"
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
                  <th scope="col" className="px-6 py-6">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-6">
                    District
                  </th>
                  <th scope="col" className="px-6 py-6">
                    Cash Advance Amount
                  </th>    
                  <th scope="col" className="px-6 py-6">
                    VISA Amount $
                  </th>  
                  <th scope="col" className="px-6 py-6">
                    MC Amount $
                  </th> 
                  <th scope="col" className="px-6 py-6">
                    CUP Amount $
                  </th>
                  <th scope="col" className="px-6 py-6">
                   Total Amount
                  </th> 
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
                    <td className="px-6 py-6">{b.branch || "-"}</td>
                    <td className="px-6 py-6">{b.district || "-"}</td>
                    <td className="px-6 py-6">{b.cash_advance_amount || "-"}</td>                   
                    <td className="px-6 py-6">{b.visa_amount || "-"}</td>
                    <td className="px-6 py-6">{b.mc_amount || "-"}</td>
                    <td className="px-6 py-6">{b.cup_amount || "-"}</td>    
                    <td className="px-6 py-6">{b.total_amount || "-"}</td> 
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
