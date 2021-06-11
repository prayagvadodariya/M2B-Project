import React, { Component } from 'react';
import { View, ScrollView, TouchableHighlight, TextInput } from 'react-native';
import axios from 'axios';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from './presentError';
import MText from './MText';

class SearchableSelectMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			isError: false,
			error: ''
        };
        
        this.fetchEvents();
    }
    
    fetchEvents = async () => {
        const userId = await getUserId();
        axios.get(`${Api.url}/${userId}/events`, {headers: Api.headers}).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    isError: false,
                    error: '',
                    data: response.data.events,
                });
            } else {
                this.setState({
                    data:[],
                    isError: true,
                    error: response.data.message
                });
            }
        }).catch((error) => {
            presentError("searchText", error.message);
        });
    }

	searchText = async (e) => {
		const text = e.toLowerCase();
		const event = this.state.data
		const filteredName = event.filter((item) => {
			return item.toLowerCase().match(text)
		})
		if (!text || text === '') {
			this.setState({
				data: this.props.data
			})
		} else if (Array.isArray(filteredName)) {
			this.setState({
				data: filteredName
			})
		}
	}

	render() {
		return (
			<View style={{
				backgroundColor: '#fff',
				padding: 10,
				borderBottomWidth: 1,
				borderLeftWidth: 1,
				borderRightWidth: 1,
				borderColor: '#aaa',
				maxHeight: 200,
			}}>
				<TextInput
					style={{
						borderWidth: 1,
						borderColor: '#aaa',
						padding: 10,
					}}
					onChangeText={(text) => this.searchText(text)}
				/>
				{
					this.state.isError
					&& (
						<MText size={18}>{this.state.error}</MText>
					)
				}

                <ScrollView contentContainerStyle={{}} nestedScrollEnabled={true} keyboardShouldPersistTaps="always">
                    {
                        this.state.data.map((item) => (
                            <TouchableHighlight
                                style={{
                                    padding: 10
                                }}
                                underlayColor="#3D5AFE"
                                key={item.id}
                                onPress={() => this.props.onItemSelect(item)}
                            >
                                <MText size={18}>{item.name}</MText>
                            </TouchableHighlight>
                        ))
                    }
                </ScrollView>
			</View>
		);
	}
}

export default SearchableSelectMT;
