function DashboardContent(){
    return(
        <div>
        <main className="flex-1 flex flex-col">
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-400 shadow-md p-6 rounded-xl">
              <h3 className="text-black-500">Total Transactions</h3>
              <p className="text-3xl font-bold mt-2">1,234,245</p>
            </div>
            <div className="bg-green-500 shadow-md p-6 rounded-xl">
              <h3 className="text-black-500">Approved Transaction</h3>
              <p className="text-3xl font-bold mt-2">912,430</p>
            </div>

            <div className="bg-amber-600 shadow-md p-6 rounded-xl">
              <h3 className="text-black-500">Declined Transactions</h3>
              <p className="text-3xl font-bold mt-2">311,815</p>
            </div>
          </div>
        </main>
        </div>
    )
}
export default DashboardContent;