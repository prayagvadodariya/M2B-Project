import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import SafeScrollView from '../components/SafeScrollView';
import InputBox from '../components/InputBox';
import Colors from '../../config/Colors';
import MButton from '../components/MButton';
import MText from '../components/MText';
import SearchableSelect from '../components/SearchableSelect';
import Card from '../components/Card';
import CardItem from '../components/CardItem';
import presentError from '../components/presentError';
import MDropDown from '../components/MDropDown';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import Loader from '../components/Loader';
import Item from './Item';
import ToggleInputBox from '../components/ToggleInputBox';
import showToast from '../components/showToast';

class EditOrder extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Edit Order',
		headerLeft: (
			<HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
		),
		headerRight: (
			<HeaderSearchButton onPress={() => navigation.navigate("Search")} />
		)
	})

	event = null;

	itemScrolled = false;

	constructor(props) {
		super(props);
		this.state = {

			displayVendorList: false,
			selectedItem: null,
			selectVendorError: null,

			displayDatePicker: false,
			selectedDate: null,

			orderNumber: null,
			boothNumber: null,
			notes: null,

			isFetchingEvents: false,
			events: [],
			isFetchingEventsError: false,
			fetchingEventsError: '',
			selectedEvent: null,
			selectEventError: null,

			isItemFromMarketTrip: false,
			items:[],

			isFetchingOrder: false,
			itemTotals: [],

			variants: [],
			openedItem: null,
			isLoading: false,
			 
			isSaved: false,

			refresh: false
		};

		this.event = this.props.navigation.getParam("event");
	}

	componentDidMount = () => {
		this.fetchOrder();
		this.fetchEvents();
	}

	fetchOrder = async () => {
		const userId = await getUserId();
		const orderId = this.props.navigation.getParam("orderId");
		this.setState({ isLoading: true });
		axios.get(`${Api.url}/${userId}/order/get/${orderId}`, { headers: Api.headers }).then((response) => {
			this.setState({ isLoading: false });
			console.log(response); 
			if (response.data.status === 'success') {
				this.setState({
					selectedItem: response.data.order.vendor,
					selectedDate: (response.data.order.expected_date !== null) ? new Date(response.data.order.expected_date) : null,
					boothNumber: response.data.order.booth_no,
					orderNumber: response.data.order.order_number,
					notes: response.data.order.notes,
					selectedEvent: response.data.order.event,
					items: response.data.items,
				}, async () => {
					if (this.state.items.length === 0) {
						await this.addNewItem();
						const variants = [];
						this.state.items.forEach((item) => {
							variants.push(item.variations);
						});
						this.setState({ variants });
					} else {
						const variants = [];
						this.state.items.forEach((item) => {
							variants.push(item.variations);
						});
						this.setState({ variants });
					}
				});
			} else {
				this.showError(response.data.message[0])
			}
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	showError = (message) => {
		this.setState({ isLoading: false }, () => {
			setTimeout(() => {
				presentError("Error", message);
			}, 200);
		});
	}

	hideDateTimePicker = () => {
		this.setState({ displayDatePicker: false });
	};

	handleDatePicked = date => {
		this.setState({
			selectedDate: date
		})
		this.hideDateTimePicker();
	};

	fetchEvents = async () => {
		this.setState({
			isFetchingEvents: true
		});
		const userId = await getUserId();
		axios.get(`${Api.url}/${userId}/events`, { headers: Api.headers }).then((response) => {
			this.setState({
				isFetchingEvents: false
			})
			if (response.data.status === 'success') {
				this.setState({
					events: response.data.events.data
				}) 
			} else {
				this.setState({
					isFetchingEventsError: true,
					fetchingEventsError: response.data.message[0]
				})
			}
		}).catch((error) => {
			this.setState({ isFetchingEvents: false });
			presentError("Error", error.message);
		});
	}

	getCurrencyFormat = (num) => {
		return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
	}

	renderTotal = () => {
		const { variants } = this.state;
		let total = 0;
		variants.forEach(element1 => {
			element1.forEach((element) => {
				if (element.quantity && element.variant_price) {
					total += (element.quantity * parseFloat(element.variant_price.toString().replace(/,/g, ''), 10));
				}
			});
		});
		return (
			<MText bold size={18} style={{ alignSelf: 'flex-start' }}>
				TOTAL : ${this.getCurrencyFormat(total)}
			</MText>
		);
	}

	getFormattedDate = (date) => {
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
	}
	
	addNewItem = async () => {
		const { items } = this.state;
		items.push({
			id: Math.random(),
			name: '',
			pictures: [],
			sku: '',
			colors: '[]',
			sizes: '[]',
			description: '',
			expected_date: null,
			variations: [],
			isNew: true
		});
		await this.setState({ items }, () => {
			this.toggleItem(this.state.items.length - 1);	
		});
	}

	toggleItem = (index) => {
		if (this.state.openedItem === index) {
			this.setState({
				openedItem: null
			});
		} else {
			this.setState({
				openedItem: index
			});
		}
	}

	onCopyItem = async (orderId, itemId) => {
		Alert.alert(
			'Copy',
			'Are you sure you want to duplicate this item?',
			[
				{
					text: 'Cancel'
				},
				{
					text: 'Ok',
					onPress: () => this.copyItem(orderId, itemId)
				}
			]
		)
	} 

	copyItem = async (orderId, itemId) => {
		this.setState({ isLoading: true });
		const userId = await getUserId();
		axios.get(`${Api.url}/${userId}/order/${orderId}/item/${itemId}/duplicate`, { headers: Api.headers }).then(async (response) => {
      if (response.data.status === 'success') {
				const { item } = response.data;
				const { items } = this.state;
				items.push(item);
				await this.setState({ items }, () => { 
					this.setState({ isLoading: false })
					const {variants} = this.state;
					variants.push(item.variations);
					this.setState({ variants }); 
				});
				showToast(response.data.message);
			} else {
				this.showError(response.data.message[0]);
			}
		}).catch((error) => {
			this.show(error.message);
		});
	}

	onDeleteItem = (orderId, itemId, index, isNew) => {
		Alert.alert(
			'Remove',
			'Are you sure you want to remove this item?',
			[
				{
					text: 'Cancel'
				},
				{
					text: 'Ok',
					onPress: () => this.deleteItem(orderId, itemId, index, isNew)
				}
			]
		)
	}

	deleteItem = async (orderId, itemId, deletedIndex, isNew) => {
		if (isNew) {
			this.setState({
				items: this.state.items.filter((_, i) => i !== deletedIndex),
				variants: this.state.variants.filter((_, i) => i !== deletedIndex)
			});
			showToast("Item removed successfully");
		} else {
			this.setState({ isLoading: true });
			const userId = await getUserId();
			axios.post(`${Api.url}/${userId}/order/${orderId}/item/${itemId}/delete`, {}, {headers: Api.headers}).then((response) => {
				if (response.data.status === 'success') {
					this.setState({
						items: this.state.items.filter((_, i) => i !== deletedIndex),
						variants: this.state.variants.filter((_, i) => i !== deletedIndex)
					});
					this.setState({ isLoading: false })
					showToast("Item removed successfully");
				} else {
					this.showError(response.data.message[0]);
				}
			}).catch((error) => {
				this.showError(error.message);
			});
		}
	}

	handleVariantChanges = (itemVariants, index) => {
		const { variants } = this.state;
		variants[index] = itemVariants;
		this.setState({ variants });
	}

	keyExtractor = (item) => item.id;

	onLayoutNewItem = (e) => {
		if (!this.itemScrolled && this.props.navigation.getParam("isFromCreateOrder")) {
			this.itemContainer.scrollTo({
				animated: true,
				x: e.nativeEvent.layout.x,
				y: e.nativeEvent.layout.y,
			});
			this.itemScrolled = true;
		}
	}

	renderItems = () => {
		const orderId = this.props.navigation.getParam("orderId");
		if (this.state.items.length > 0) {
			return (
        <ScrollView
          onLayout={this.onLayoutNewItem}
        >
          {
            this.state.items.map((item, index) => (
              <Item 
                key={item.id}
                isAvailable={(item.isNew === undefined)}
                isNew={(item.isNew !== undefined)}
                item={item} 
                orderId={orderId} 
                event={this.event} 
                index={index}
                handleVariantChanges={(itemVariants) => {
                  this.handleVariantChanges(itemVariants, index);
                }}
                addNewItem={this.addNewItem}
                display={this.state.openedItem === index}
                onPress={() => this.toggleItem(index)}
                onCopyItem={(oId, iId, delIndex) => { this.onCopyItem(oId, iId, delIndex) }}
                onDeleteItem={(oId, iId, delIndex, isNew) => { this.onDeleteItem(oId, iId, delIndex, isNew) }}
                disableDelete={(this.state.items.length === 1)}
                itemSaved={this.itemSaved}
                defaultSelectedDate={this.state.selectedDate}
              />
            ))
          }
        </ScrollView>




				// <FlatList
				// 	data={this.state.items}
				// 	extraData={this.state}
				// 	keyExtractor={this.keyExtractor}
				// 	ref={(ref) => { this.flatlist = ref }}
        //   onLayout={this.onLayoutNewItem}
        //   initialNumToRender={5}
				// 	renderItem={({item, index}) => (
				// 		<Item 
				// 			// key={item.id}
				// 			isAvailable={(item.isNew === undefined)}
				// 			isNew={(item.isNew !== undefined)}
				// 			item={item} 
				// 			orderId={orderId} 
				// 			event={this.event} 
				// 			index={index}
				// 			handleVariantChanges={(itemVariants) => {
				// 				this.handleVariantChanges(itemVariants, index);
				// 			}}
				// 			addNewItem={this.addNewItem}
				// 			display={this.state.openedItem === index}
				// 			onPress={() => this.toggleItem(index)}
				// 			onCopyItem={(oId, iId, delIndex) => { this.onCopyItem(oId, iId, delIndex) }}
				// 			onDeleteItem={(oId, iId, delIndex, isNew) => { this.onDeleteItem(oId, iId, delIndex, isNew) }}
				// 			disableDelete={(this.state.items.length === 1)}
				// 			itemSaved={this.itemSaved}
				// 			defaultSelectedDate={this.state.selectedDate}
				// 		/>
				// 	)}
				// />
			)
		}
		return (
			<Item 
				isAvailable={false}
				isNew={true}
				item={{isNew: true}}
				orderId={orderId} 
				event={this.event} 
				index={0}
				handleVariantChanges={(itemVariants) => {
					this.handleVariantChanges(itemVariants, 0);
				}}
				addNewItem={this.addNewItem}
				display={this.state.openedItem === 0}
				onPress={() => this.toggleItem(0)}
				onCopyItem={this.onCopyItem}
				onDeleteItem={this.onDeleteItem}
				itemSaved={this.itemSaved}
				defaultSelectedDate={this.state.selectedDate}
			/>	
		)
	}

	updateAsDraft = async (isOrderNow) => {
		if (this.state.selectedItem === null || this.state.selectedItem === undefined) {
			this.setState({
				selectVendorError: "Please select vendor"
			});
			return;
		}
		
		this.setState({ isLoading: true });
		const userId = await getUserId();
		const orderId = this.props.navigation.getParam("orderId");
		const param = {
			"vendor_id":this.state.selectedItem.id,
			"notes": this.state.notes,
			"order_number": this.state.orderNumber,
			"booth_no": this.state.boothNumber,
			"event_id": (this.state.selectedEvent !== null && this.state.selectedEvent !== undefined) ? this.state.selectedEvent.id : null,
			"global_date": (this.state.selectedDate !== null) ? this.getFormattedDate(new Date(this.state.selectedDate)) : null
		}
		if (isOrderNow) {
			param.status = "ordered";
		}
		axios.post(`${Api.url}/${userId}/order/update/${orderId}`, param, {headers: Api.headers}).then((response) => {
			this.setState({ isLoading: false, selectEventError: null, selectVendorError: null });
			if (response.data.status === 'success') {
				showToast(response.data.message);
				if (this.props.navigation.getParam("isFromViewOrder") === true) {
					this.props.navigation.state.params.onGoBack(true);
					this.props.navigation.goBack();
				} else {
					this.props.navigation.state.params.onGoBack(true);
					const navigateAction = NavigationActions.navigate({
						routeName: 'Orders',
						params: {isOrderUpdated: true},
						action: NavigationActions.navigate({ routeName: 'CreateOrder' }),
					});
					this.props.navigation.dispatch(navigateAction);
				}
			} else {
				showToast(response.data.message[0]);
			}
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	duplicateOrder = async () => {
		this.setState({ isLoading: true });
		const orderId = this.props.navigation.getParam("orderId");
		const userId = await getUserId();
		const path = `${Api.url}/${userId}/order/duplicate/${orderId}`;
		axios.get(path, { headers: Api.headers }).then((response) => {
			if (response.data.status === 'success') {
				this.setState({ isLoading: false }, () => {
					showToast(response.data.message);
					this.props.navigation.state.params.onGoBack();
					this.props.navigation.goBack();
				});
			} else {
				this.showError(response.data.message[0]);
			}
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	itemSaved = async () => {
		this.setState({ isSaved: true });
	}

	renderOrderNow = () => {
		let btn;
		this.state.items.every(async (element) => {
			if (element.status !== undefined || this.state.isSaved) {
				btn = (
					<MButton
						text="ORDER NOW"
						pink
						style={{ marginHorizontal: 5, marginVertical: 5, paddingHorizontal: 10 }}
						onPress={() => this.updateAsDraft(true)}
					/>
				)
				return false
			} 
			return true
		});
		return btn;
	} 

	render() {
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
				<SafeScrollView style={{ flex: 1, backgroundColor: Colors.bgGray }}>
					
					<Loader loading={this.state.isLoading} />
					
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.container}
						keyboardShouldPersistTaps="handled"
						nestedScrollEnabled={true}
						keyboardDismissMode={'on-drag'}
						ref={(itemContainer) => { this.itemContainer = itemContainer }}
					>
						<Card style={{ backgroundColor: '#fff', padding: 10 }}>
							
							{
								this.event && (
									<View style={{ paddingVertical: 10, flexDirection: 'row', borderBottomColor: Colors.border, borderBottomWidth: 1 }}>
										<MText bold size={18}>Event : </MText>
										<MText size={18}>{" "}{this.event.name}</MText>
									</View>
								)
							}

							{/* -------- Select Vendor  ------------ */}
							<View style={{ marginVertical: 5 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<MText style={styles.label} bold size={18}> Select Vendor </MText>
									<MText bold size={20} pink>*</MText>
								</View>
								<TouchableOpacity
									style={styles.selectBox}
									activeOpacity={1.0}
									onPress={() => {
										this.setState(prevState => ({
											displayDatePicker: false,
											displayVendorList: !prevState.displayVendorList
										}));
									}}
								>
									<MText size={18}>{(this.state.selectedItem === null) ? 'Select Vendor' : this.state.selectedItem.name}</MText>
									<Icon name="caret-down" />
								</TouchableOpacity>
							</View>
							<Modal 
								isVisible={this.state.displayVendorList}
								avoidKeyboard={true}
								backdropOpacity={0.2}
								backdropTransitionOutTiming={0}
								animationIn="fadeIn"
								animationOut="fadeOut"
								animationInTiming={100}
								animationOutTiming={100}
								onBackdropPress={() => this.setState({ displayVendorList: false})}
							>
								<SearchableSelect
									onItemSelect={(item) => {
										this.setState({
											selectedItem: item,
											displayVendorList: false
										})
									}}
								/>
							</Modal>
							{/* {
								this.state.displayVendorList
								&& (
									// <View style={styles.searchResult}>
										<SearchableSelect
											onItemSelect={(item) => {
												this.setState({
													selectedItem: item,
													displayVendorList: false
												})
											}}
										/>
									// </View>
								)
							} */}
							{
								this.state.selectVendorError && (
									<View style={{paddingHorizontal: 20}}>
										<MText size={14} pink>{this.state.selectVendorError}</MText>
									</View>
								)
							}

							{/* --------------- select vendor ends --------------- */}

							<MDropDown
								label="Add To Market Trip"
								labelBold={true}
								required
								placeholder="Select Market Trip"
								data={this.state.events}
								searchable={true}
								onSelectItem={(selectedEvent) => {
									this.setState({ selectedEvent })
								}}
								selectedItem={this.state.selectedEvent}
								isLoading={this.state.isFetchingEvents}
								isError={this.state.isFetchingEventsError}
								error={this.state.fetchingEventsError}
							/>
							{
								this.state.selectEventError && (
									<View style={{paddingHorizontal: 20}}>
										<MText size={14} pink>{this.state.selectEventError}</MText>
									</View>
								)
							}

							<InputBox
								value={this.state.orderNumber}
								label="Purchase Order Number"
								placeholder="Type Here"
								returnKeyType={"next"}
								onChangeText={(orderNumber) => this.setState({ orderNumber })}
							/>

							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<MText style={styles.label} bold size={18}>
									Expected Ship Date
								</MText>
							</View>
							<TouchableOpacity
								style={styles.selectBox}
								activeOpacity={1.0}
								onPress={() => {
									this.setState(prevState => ({
										displayVendorList: false,
										displayDatePicker: !prevState.displayDatePicker
									}));
								}}
							>
								<MText size={18}>{(this.state.selectedDate === null) ? 'Select Date' : this.state.selectedDate.toLocaleDateString()}</MText>
							</TouchableOpacity>
							<DateTimePicker
								isVisible={this.state.displayDatePicker}
								onConfirm={this.handleDatePicked}
								onCancel={this.hideDateTimePicker}
							/>

							<InputBox
								value={this.state.boothNumber}
								label="Booth No"
								placeholder="Type Here"
								onChangeText={(boothNumber) => this.setState({ boothNumber })}
							/>

							<ToggleInputBox 
								label="Notes"
								value={this.state.notes}
								onChangeText={(notes) => this.setState({ notes })}
							/>
							

							{/* ---------------- Item start here ----------------- */}
							{this.renderItems()}


							<MButton
								text="ADD ADITIONAL ITEM TO ORDER"
								style={{ margin: 10, zIndex: -1 }}
								onPress={this.addNewItem}
							/>

							<CardItem>
								<View style={{ alignItems: 'center', flex: 1 }}>
									{this.renderTotal()}
									{
										this.props.navigation.getParam("isFromViewOrder") === true ? (
											<MButton
												text="SAVE"
												pink
												style={{ marginHorizontal: 5, marginVertical: 5, paddingHorizontal: 10 }}
												onPress={() => this.updateAsDraft(true)}
											/>
										) : (
											<React.Fragment>
												<View style={{flexDirection: 'row'}}>
													{this.renderOrderNow()}
													<MButton
														text="UPDATE AS DRAFT"
														teal
														style={{ marginHorizontal: 5, marginVertical: 5, paddingHorizontal: 10 }}
														onPress={() => this.updateAsDraft(false)}
													/>
												</View>
												<MButton
													text=" DUPLICATE ORDER"
													blue
													iconLeft={(
														<Icon name="clone" color="#fff" size={18} />
													)}
													style={{ marginVertical: 5 }}
													onPress={() => this.duplicateOrder()}
												/>
											</React.Fragment>
										)
									}
								</View>
							</CardItem>
						</Card>
					</ScrollView>
				</SafeScrollView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		backgroundColor: Colors.bgGray,
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	label: {
		marginLeft: 20,
		marginVertical: 5,
	},
	tableContainer: {
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 10,
		marginVertical: 10
	},
	tableHeader: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 10,
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	tableBody: {
		padding: 10
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 10
	},
	tableInput: {
		padding: 10,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 50,
		width: 100,
		height: 50,
		marginHorizontal: 10
	},
	colFirst: {
		width: 150,
	},
	col: {
		width: 100,
		alignItems: 'center',
		marginHorizontal: 5
	},
	searchResult: {
		position: 'absolute',
		zIndex: 2,
		backgroundColor: '#fff',
		top: 110,
		left: 10,
		right: 10
	},
	searchResultMT: {
		position: 'absolute',
		backgroundColor: '#fff',
		top: 190,
		left: 10,
		right: 10
	},
	searchResultCat: {
		position: 'absolute',
		backgroundColor: '#fff',
		top: 380,
		left: 10,
		right: 10
	},
	sizesContainer: {
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 10,
		flexDirection: 'row',
		padding: 5,
		flexWrap: 'wrap'
	},
	sizesLabel: {
		marginLeft: 20,
		marginVertical: 5
	},
	sizesInput: {
		borderWidth: 0,
		flex: 1,
		justifyContent: 'center',
		height: 30,
		margin: 5,
		minWidth: 100
	},
	selectBox: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#ffffff',
		borderColor: Colors.border,
		borderWidth: 1,
	},
	tagContainer: {
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 10,
		minHeight: 50,
	},
	tag: {
		height: 30,
		borderWidth: 1,
		borderColor: "#aaa",
		borderRadius: 5,
		padding: 5,
		margin: 5,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: Colors.bgGray
	},
	lottie: {
		width: 100,
		height: 100
	}
});

export default EditOrder;
