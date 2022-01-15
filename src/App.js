import React, { Component } from 'react'
import JokeList from './components/JokeList'
import './css/App.css';

export class App extends Component {
    render() {
        return (
            <div className='App'>
                <JokeList />
            </div>
        )
    }
}

export default App
