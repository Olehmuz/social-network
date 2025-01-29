import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/ui/resizable'
import { ChatList } from '@/widgets/chat/ui/chat-list'
import { Outlet } from 'react-router'


const App = () => {
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
