import Link from 'next/link';
import Image from 'next/image';
import { Buttoncito } from './Buttoncito';


export default function Navigation() {
	  return (
	<nav suppressHydrationWarning className=" flex items-center justify-between">
		<div suppressHydrationWarning className='m-2 p-2' >
	 <Image src="/asset_logo.svg" alt="" width={150} height={150} />
		</div>
	  <div suppressHydrationWarning className="flex space-x-4">
		<Link href="/">
		<button className="btn btn-outline text-xl btn-warning">Home</button>
		</Link>
		<Link href="/leaderboard">
		<button className="btn btn-outline text-xl btn-warning">Leaderboard</button>
		</Link>
		<Link href="/friends">
		<button className="btn btn-outline text-xl btn-warning">Friends</button>
		</Link>
		<Link href="/profile">
		<button className="btn btn-outline text-xl btn-warning">Profile</button>
		</Link>
		<Buttoncito />
	  </div>
	</nav>
  );
}