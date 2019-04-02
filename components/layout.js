import Head from 'next/head';

const defaultTitle = 'Topics Manager';

const Layout = ({ children, title }) => (<>
  <Head>
    <title>{!!title ? `${title} • ${defaultTitle}` : defaultTitle}</title>
    
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <meta charSet='utf-8' />
    
    <link rel="apple-touch-icon" sizes="120x120" href="/static/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
    <link rel="manifest" href="/static/site.webmanifest" />
    <link rel="mask-icon" href="/static/safari-pinned-tab.svg" color="#0000" />
    <link rel="shortcut icon" href="/static/favicon.ico" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="msapplication-config" content="/static/browserconfig.xml" />
    <meta name="theme-color" content="#ffffff" />
  </Head>
  {children}
</>);

export default Layout;
