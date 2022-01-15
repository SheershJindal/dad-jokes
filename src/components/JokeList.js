import React, { Component } from 'react'
import axios from "axios"
import { v4 as uuid } from "uuid"
import Joke from './Joke'
import './css/JokeList.css'

export class JokeList extends Component {
    static defaultProps = {
        numJokesFetched: 10
    };
    constructor(props) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false
        };
        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        if (this.state.jokes.length === 0) {
            this.fetchJokes();
        }
    }
    async fetchJokes() {
        try {
            let jokes = []
            while (jokes.length < this.props.numJokesFetched) {
                let res = await axios.get("https://icanhazdadjoke.com/", {
                    headers: { Accept: "application/json" }
                });
                let newJoke = res.data.joke;
                if (!this.seenJokes.has(newJoke))
                    jokes.push({ id: uuid(), text: newJoke, votes: 0 });
            }
            this.setState(st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes]
            }),
                () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)));
        } catch (e) {
            alert(e);
            this.setState({loading: false});
        }
    }
    handleVote(id, change) {
        this.setState(
            st => ({
                jokes: st.jokes.map(j =>
                    j.id === id ? { ...j, votes: j.votes + change } : j
                )
            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        )
    }
    handleClick() {
        this.setState({ loading: true }, this.fetchJokes);
    }
    render() {
        if (this.state.loading) {
            return (
                <div className='JokeList-spinner'>
                    <i className='far fa-8x fa-laugh fa-spin' />
                    <h1 className='JokeList-title'>Loading New Jokes...</h1>
                </div>
            )
        }
        let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes);
        return (
            <div className='JokeList'>
                <div className='JokeList-sidebar'>
                    <h1 className='JokeList-title'>Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className='JokeList-more' onClick={this.handleClick}>More Jokes</button>
                </div>

                <div className='JokeList-jokes'>
                    {jokes.map(j => (
                        <Joke
                            key={j.id}
                            votes={j.votes}
                            text={j.text}
                            upvote={() => this.handleVote(j.id, 1)}
                            downvote={() => this.handleVote(j.id, -1)}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default JokeList
