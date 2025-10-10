import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NotificationDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <button className="relative">
          <span className=" text-gray-500 hover:text-gray-700">
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4387 16.0759C10.3774 17.2392 10.4478 18.4775 9.40846 19.257C8.92471 19.6199 8.64001 20.1892 8.64001 20.7939C8.64001 21.6257 9.29151 22.3334 10.14 22.3334H22.14C22.9885 22.3334 23.64 21.6257 23.64 20.7939C23.64 20.1892 23.3553 19.6199 22.8716 19.257C21.8322 18.4775 21.9026 17.2392 21.8413 16.0759C21.6818 13.0435 19.1765 10.6667 16.14 10.6667C13.1035 10.6667 10.5982 13.0435 10.4387 16.0759Z"
                stroke="#868C98"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.89 9.10419C14.89 9.79455 15.4497 10.6667 16.14 10.6667C16.8303 10.6667 17.39 9.79455 17.39 9.10419C17.39 8.41383 16.8303 8.16669 16.14 8.16669C15.4497 8.16669 14.89 8.41383 14.89 9.10419Z"
                stroke="#868C98"
                stroke-width="1.8"
              />
              <path
                d="M18.64 22.3333C18.64 23.7141 17.5208 24.8333 16.14 24.8333C14.7593 24.8333 13.64 23.7141 13.64 22.3333"
                stroke="#868C98"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              
            </svg>
          </span>
          {/* Notification Badge */}
          <span className="absolute top-0  right-1 inline-flex items-center justify-center py-1 px-1 w-3 h-3 text-xs font-bold text-white bg-red-500 rounded-full">2</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
