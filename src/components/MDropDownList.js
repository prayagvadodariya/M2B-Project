import React, { Component } from 'react';
import { View, TouchableHighlight, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import ViewOverflow from 'react-native-view-overflow';
import MText from './MText';
import FetchingLoader from './FetchingLoader';
import FetchingError from './FetchingError';

class MDropDownList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data,
		};
	}

	componentWillReceiveProps = (props) => {
		this.setState({
			data: props.data
		});
		if (this.props.selectedIndex) {
			this.handleOnPress(this.state.data[this.props.selectedIndex]);
		}
	}

	handleOnPress = (item) => {
		this.props.onSelectItem(item);
	}

	search = async (e) => {
		const text = e.toLowerCase()
		const items = this.props.data
		const filteredName = items.filter((item) => {
			return item.name.toLowerCase().match(text)
		});
		if (!text || text === '') {
			this.setState({
				data: this.props.data
			});
		} else if (Array.isArray(filteredName)) {
			this.setState({
				data: filteredName
			});
		}
	}

	render() {
		return (
			<View style={{justifyContent: 'center'}}>
				<View 
					style={{
						backgroundColor: '#fff',
						borderWidth: 1,
						borderColor: "#aaa",
						borderRadius: 10,
						borderTopWidth: 0,
						maxHeight: 250,
						minHeight: 250,
						shadowColor: '#aaa',
						shadowOffset: {
							height: 0,
							width: 0
						},
						shadowOpacity: 1,
						shadowRadius: 10
					}}
				>
					<View style={{alignItems: 'center', justifyContent: 'center', padding: 5}}>
						<MText bold size={18}>{this.props.placeholder}</MText>
					</View>
					{
						this.props.isLoading && (
							<FetchingLoader />
						)
					}
					{
						this.props.isError && (
							<View style={{padding: 10, alignItems: 'center'}}>
								<MText>{this.props.error}</MText>
							</View>
						)
					}
					{
						!this.props.isLoading && !this.props.isError && this.props.searchable && (
							<TextInput
								style={{
									borderWidth: 1,
									borderColor: "#aaa",
									margin: 10,
									paddingVertical: 5,
									paddingHorizontal: 10,
									height: 40,
									fontSize: 18
                }}
                autoFocus
								placeholder="Search Here"
								onChangeText={(text) => this.search(text)}
							/>
						)
					}
					<ScrollView keyboardShouldPersistTaps="always">
					{
						!this.props.isLoading && !this.props.isError && (
							this.state.data.map((item, index) => (
								<TouchableHighlight
										style={{
											padding: 10,
											backgroundColor: '#fff',
											marginHorizontal: 10,
										}}
										underlayColor="#5897fb"
										key={index.toString()}
										onPress={() => this.props.handleOnPress(item)}
									>
										<MText size={18}>{item.name}</MText>
								</TouchableHighlight>
							))
						)
					}
					</ScrollView>
					{/* {
						!this.props.isLoading && !this.props.isError && (
							<FlatList
								data={this.state.data}
								keyboardShouldPersistTaps="always"
								nestedScrollEnabled={true}
								listKey={(item, index) => index.toString()}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<TouchableHighlight
										style={{
											padding: 10,
											backgroundColor: '#fff',
											marginHorizontal: 10,
										}}
										underlayColor="#5897fb"
										onPress={() => this.props.handleOnPress(item)}
									>
										<MText size={18}>{item.name}</MText>
									</TouchableHighlight>
								)}
							/>
						)
					} */}
				</View>
			</View>
		);
	}
}

export default MDropDownList
