function Topbar(){
    return(
        <div>
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-amber-800">Dashboard</h2>
            <div className="flex items-center gap-3">
              {/* <span className="font-medium">Admin</span> */}
              <img
                src="/src/assets/svg/imageeeeu.png"
                alt="avatar"
                className="w-25 h-20"
              />
            </div>
          </header>
        </div>
    )
}

export default Topbar;