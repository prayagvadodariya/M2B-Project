import React, { Component } from 'react';
import { View, ScrollView, TouchableHighlight, TextInput } from 'react-native';
import axios from 'axios';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from './presentError';
import MText from './MText';
import FetchingLoader from './FetchingLoader';

class SearchableSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			text: '',
			isError: false,
			error: '',
			isFetching: false
		};
	}

	searchText = async (e) => {
		this.setState({
			text: e
		})

		if (e.length >= 3) {
			this.setState({
				isFetching: true
			});
			const userId = await getUserId();
			axios.get(`${Api.url}/${userId}/vendor/search?vendor=${e}`, { headers: Api.headers }).then((response) => {
				this.setState({
					isFetching: false
				});
				if (response.data.status === 'success') {
					this.setState({
						isError: false,
						error: '',
						data: response.data.vendors,
					});
				} else {
					this.setState({
						data: [],
						isError: true,
						error: response.data.message
					});
				}
			}).catch((error) => {
				presentError("searchText", error.message);
			});
		}
	}

	render() {
		return (
			<View style={{
				backgroundColor: '#fff',
				padding: 10,
				// borderBottomWidth: 1,
				// borderLeftWidth: 1,
				// borderRightWidth: 1,
				borderColor: '#aaa',
				borderWidth: 1,
				borderRadius: 10,
				maxHeight: 250,
				minHeight: 250,
				zIndex: 999,
				shadowColor: '#aaa',
				shadowOffset: {
					height: 0,
					width: 0
				},
				shadowOpacity: 1,
				shadowRadius: 10
			}}>
				<TextInput
					style={{
						borderWidth: 1,
						borderColor: '#aaa',
						padding: 10,
						paddingVertical: 5,
						paddingHorizontal: 10,
						height: 40,
						fontSize: 18
          }}
          autoFocus
					placeholder="Search Here"
					onChangeText={(text) => this.searchText(text)}
				/> 
				{
					this.state.text.length >= 3 && this.state.isError
					&& (
						<MText size={18}>{this.state.error}</MText>
					)
				}

				{
					this.state.text.length < 3 && (
						<View>
							<MText size={16}>Please enter {3 - this.state.text.length} or more character</MText>
						</View>
					)
				}
				{
					this.state.isFetching && (
						<FetchingLoader />
					)
				}
				{this.state.text.length >= 3 && (
					<ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="always">
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
				)}

			</View>
		);
	}
}

export default SearchableSelect;
