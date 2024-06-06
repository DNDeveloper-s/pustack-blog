import { useLink } from '@/context/LinkContext';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AppLinkProps extends LinkProps {
    children: React.ReactNode;
    href: string;
    className?: string;
}
export default function AppLink({children, prefetch = true, className, ...props}: AppLinkProps) {
    const router = useRouter();
    const {isGuard} = useLink();

    useEffect(() => {
        try {
            prefetch && props.href && router.prefetch(props.href)
        } catch(e) {
            console.error(e)
        }
    }, [router, prefetch])

    return (
        <div className={'cursor-pointer ' + className} onClick={() => {
            if(isGuard) {
                console.error('Route change aborted by the user')
                return;
            }
            router.push(props.href)
        }}>
            {children}
        </div>
    )
}