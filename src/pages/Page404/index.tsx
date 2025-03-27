import { Result } from 'antd'
import { Link } from 'react-router-dom'
// import logo from '../../assets/images/logo_black.png'

const Page404 = () => {
  // TODO: add logo
  return (
    <Result
      // icon={<img src={logo} alt='Krateo | PlatformOps' width={400} />}
      extra={<Link to='/'>Go to the Home page</Link>}
      subTitle="We can't find the page you're looking for"
      title='404 Page not found'
    />
  )
}

export default Page404
