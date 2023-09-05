import Drawer from './drawer'
import { Node, getTree } from './node'

export default function Home() {
    const node = getTree(1, 4)

    return <Drawer node={node} />
}
