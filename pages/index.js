import React from 'react'
import ky from 'ky-universal';

const gh = `https://api.github.com`;

class PageIndex extends React.Component {
  static async getInitialProps({ req }) {
    const user = `iamstarkov`;
    // const user = `JacobBlomgren`;
    try {
      const repos = await ky(`${gh}/users/${user}/repos`).json();
      return { repos }
    } catch (error) {
      return { error };
    }
  }

  render() {
    const { repos, error } = this.props;
    return <ul>{repos.map(x => <li key={x.full_name}>{x.full_name}</li>)}</ul>
//    return repos[0].full_name;
   //  return <pre>{JSON.stringify(error||repos, null, 2)}</pre>
  }
}

export default PageIndex 
