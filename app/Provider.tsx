'use client';

import Loader from '@/components/Loader';
import { LiveblocksProvider, ClientSideSuspense} from '@liveblocks/react/suspense'
import { ReactNode } from 'react';
import { getClerkUsers } from '@/lib/actions/user.actions'


const Provider = ( {children}: {children: ReactNode}) => {
  return (
    <LiveblocksProvider 
    authEndpoint='/api/liveblocks-auth'
    resolveUsers={async ({ userIds }) => {
      const users = await getClerkUsers({userIds})

      return users;
    }}
    >

      <ClientSideSuspense fallback={<Loader/>}>
        {children}
      </ClientSideSuspense>
    l</LiveblocksProvider>
  )
}

export default Provider