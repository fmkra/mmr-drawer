import { Input } from './input';
import { Animation } from './animation';

export default function GetHeightPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const size = parseInt(searchParams.size as string);
    const node = parseInt(searchParams.node as string);

    if (size && node) {
        return <Animation size={size} node={node} />;
    }
    return <Input />;
}
