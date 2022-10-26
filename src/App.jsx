import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css';
import '@aws-amplify/ui-react/styles.css'

import { Authenticator } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import * as ampQueries from './graphql/queries';

import {
  useQuery,
  // useQueryClient
} from '@tanstack/react-query';

function App() {

  const [nextPage, set_nextPage] = useState(null);
  const [prevPage, set_prevPage] = useState(null);

  const queryData = useQuery(['todos',nextPage,prevPage],() => getAmplifyTodos(nextPage,prevPage));

  return (
    <div className="App">
      <Authenticator>
        {
          ({signOut,user}) => (
            <>
              <div>
                <a href="https://vitejs.dev" target="_blank"><img src="/vite.svg" className="logo" alt="Vite logo" /></a>
                <a href="https://reactjs.org" target="_blank"><img src={reactLogo} className="logo react" alt="React logo" /></a>
              </div>
              <h1>Amplify + React Query</h1>

              <div className="card">
                { queryData.status === 'loading' && ( <p>Loading...</p> ) }
                { queryData.status === 'error' && ( <p>Some Error Happened</p> ) }
                {
                  queryData.status === 'success' && (
                    <>
                      { queryData.data.data.listTodos.items.map(todo => ( <p key={todo.id}>{todo.name}</p> )) }
                      <p>{queryData.data.data.listTodos.nextToken}</p>
                      <button>Prev</button>

                      {queryData.data.data.listTodos.nextToken && (
                         <button onClick={() => set_nextPage(queryData.data.data.listTodos.nextToken)}>Next</button>
                      )}
                     
                    </>
                  )
                }
              </div>
              <div className="card">
                <button onClick={signOut}>Sign Out</button>
              </div>
            </>
          )
        }
      </Authenticator>
    </div>
  )
}

const getAmplifyTodos = async (next,prev) => {
  try {
    const res = API.graphql({
      query: ampQueries.listTodos,
      variables: {
        limit: 2,
        nextToken: next
      }
      // authMode: 'AWS_IAM'
    });
    return res;
  } catch (e) {
    return e;
  }
}

export default App
