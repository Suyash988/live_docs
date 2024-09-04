import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";


const Document = async ({ params: {id}}: SearchParamProps) => {
  const clerkUser = await currentUser();
  if(!clerkUser) redirect('/sign-in');

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if(!room) redirect('/');

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({userIds});

  const usersData = users
    .filter((user: any): user is User => user !== null && "email" in user)
    .map((user: User) => {
      const condition = room.usersAccesses[user.email]?.includes("room:write");
      return {
        ...user,
        userType: condition ? "editor" : "viewer",
      };
    });

  // const usersData = users.map((user: User) => {
  //   const userEmail = user.email;
  //   return {
  //   ...user,
  //   userType: userEmail &&  room.usersAccesses[user.email]?.includes('room:write')
  //   ? 'editor'
  //   : 'viewer'
  //   }
  // })

  // const usersData = users.map((user: User) => {
  //   if (!user || !user.email) {
  //     return {
  //       ...user,
  //       userType: 'viewer', // Default userType if user or user.email is null
  //     };
  //   }
  
  //   const userEmail = user.email;
  //   return {
  //     ...user,
  //     userType: room.usersAccesses[userEmail]?.includes('room:write')
  //       ? 'editor'
  //       : 'viewer'
  //   };
  // });


  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';
 
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata} 
        users={usersData}    
        currentUserType={currentUserType}  
        />
    </main>
      
    
  )
}

export default Document