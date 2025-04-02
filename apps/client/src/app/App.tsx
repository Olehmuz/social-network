import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/ui/resizable'
import { ChatList } from '@/widgets/chat/ui/chat-list'
import { Outlet, useParams } from 'react-router'


const App = () => {
  const activeRoomId = useParams().chatId;

  return (
    <div className='flex flex-col w-full h-[100vh] justify-center items-center flex-1'>
      <ResizablePanelGroup className='sidebar w-full' direction="horizontal">
        <ResizablePanel className='border-r' 
          defaultSize={17}
          minSize={17}
        >
          <ChatList />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Outlet />
          {!activeRoomId && (
            <div className="flex h-full items-center justify-center">
              <p className="text-xl font-semibold text-slate-500">
                Select a room to start chatting
              </p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
