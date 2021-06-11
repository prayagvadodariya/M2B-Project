import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert, Image, Platform, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from "react-native-modal-datetime-picker";
import ImagePicker from 'react-native-image-crop-picker';
// eslint-disable-next-line import/no-unresolved
import ImageResizer from 'react-native-image-resizer';
import TagInput from 'react-native-tag-input';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import Api from '../../config/Api';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import Card from '../components/Card';
import MButton from '../components/MButton';
import DeleteButton from '../components/DeleteButton';
import CopyButton from '../components/CopyButton';
import InputBox from '../components/InputBox';
import MDropDown from '../components/MDropDown';
import MTag from '../components/MTag';
import TrashButton from '../components/TrashButton';
import Loader from '../components/Loader';
import ToggleInputBox from '../components/ToggleInputBox';
import showToast from '../components/showToast';

const FormError = (props) => {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -10 }}>
			<MText style={styles.label} size={16} pink>{props.children}</MText>
		</View>
	)
}

const Badge = (props) => {
	let badgeColor = Colors.pink;
	if (props.teal) {
		badgeColor = Colors.teal
	} else if (props.darkBlue) {
		badgeColor = Colors.darkBlue
	} else if (props.danger) {
		badgeColor = "#dc3545"
	} else if (props.primary) {
		badgeColor = "#28a745"
	} else if (props.gray) {
		badgeColor = "#6c757d"
	}
	return (
		<View style={[
			{
				backgroundColor: props.color || badgeColor,
				paddingVertical: 0,
				paddingHorizontal: 5,
				marginHorizontal: 5,
				borderRadius: 20,
				alignItems: 'center',
				justifyContent: 'center'
			},
			{
				...props.style
			}
		]}>
			{props.children}
		</View>
	)
}

const keyBoardType = (Platform.OS === 'ios') ? 'numeric' : 'phone-pad';

class Item extends Component {
	selectedCategory = null;

	itemId = '';

	addedImages = [];

	constructor(props) {
		super(props);
		this.state = {
			display: false,
			
			id: '',
			itemName: '',
			selectedPictures: [],
			selectedPictureError: null,
			sku: '',
			skuError: null,
			isVerifyingSku: false,

			selectedCategory: null,
			isFetchingCategories: false,
			categories: [],
			isFetchingCategoriesError: false,
			fetchingCategoriesError: '',

			colors: [],
			sizes: [],

			status: null,

			defaultQuantity: '',
			defaultPrice: '',
			defaultCost: '',

			variants: [],

			displayShipDatePicker: false,
			selectedShipDate: null,
			description: '',

			isSavingItem: false,
			isSavingItemError: false,
			savingItemError: '',

			isAvailable: this.props.isAvailable,
			isNew: this.props.isNew,

			defaultMarkup: 0,

			locations: [],
			selectedLocation: null,
			removedImages: [],
			selectedWeightUnit: 'lb',
			weight: '',
			barcode: '',
			
			isDataSetted: false,

			duplicateBarcode: false,
			roundPrice: 0,
			imageIsNull: false,

			primaryLocation: null,
			displayVariant: false,

			tags: [],
		};
	}

	componentDidMount = async () => {
    if (this.state.isAvailable) {
			const { item } = this.props;
			console.log(item);
			this.setState({
				id: item.id,
				itemName: item.name || '',
				selectedPictures:item.pictures || [],
				sku: item.sku || '',
				colors: JSON.parse(item.colors || "[]") || [],
				sizes: JSON.parse(item.sizes || "[]") || [],
				tags: item.tags || [],
				description: item.description || '',
				selectedShipDate: (item.expected_date !== null) ? new Date(item.expected_date) : null, 
				variants: item.variations || [],
				status: item.status,
				barcode: item.barcode,
				selectedWeightUnit: item.weight_unit,
				weight: item.weight,
				imageIsNull: item.pictures === undefined || item.pictures === null || item.pictures.length === 0 
			});
		} else {
      this.setState({ status: 'unsaved' });
    }
		
		if (!this.state.isAvailable) {
			this.setState({ selectedShipDate: this.props.defaultSelectedDate });
		}
	}

	setData = async () => {
		this.setState({ isSavingItem: true });
		await this.fetchCategories();
		if (this.state.status === 'unsaved') {
			this.setDefaultQuantity();
		}
		this.setDefaultMarkup();
		this.fetchLocations();
		this.setSettings();
		this.setState({ isSavingItem: false });
	}

	setSettings = async () => {
		const userId = await getUserId();
		await axios.get(`${Api.url}/${userId}/settings/defaults`, { headers: Api.headers}).then((response) => {
			this.setState({
				roundPrice: response.data.round_price,
				duplicateBarcode: response.data.barcode === 1 ? true : false
			});
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	setDefaultQuantity = async () => {
		const userId = await getUserId();
		await axios.get(`${Api.url}/${userId}/settings/defaults`, { headers: Api.headers}).then((response) => {
			this.setState({
				defaultQuantity: response.data.quantity,
				defaultMarkup: response.data.markup_price
			}, () => {
				const { variants } = this.state;
				for (let i = 0; i < variants.length; i++) {
					variants[i].quantity = this.state.defaultQuantity;
					variants[i].markupPrice = this.state.defaultCost * this.state.defaultMarkup;
				}
				this.setState({ variants }, () => this.props.handleVariantChanges(this.state.variants));
			});
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	setDefaultMarkup = async () => {
		const userId = await getUserId();
		await axios.get(`${Api.url}/${userId}/settings/defaults`, { headers: Api.headers}).then((response) => {
			this.setState({
				defaultMarkup: response.data.markup_price
			}, () => {
				const { variants } = this.state;
				for (let i = 0; i < variants.length; i++) {
					variants[i].markupPrice = this.state.defaultCost * this.state.defaultMarkup;
				}
				this.setState({ variants }, () => this.props.handleVariantChanges(this.state.variants));
			});
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	componentWillReceiveProps = async (props) => {
		if (props.display === true && props.display !== this.props.display) {
      this.setState({ isSavingItem: true });
      if (!this.state.isDataSetted) {
				await this.setData();
				this.setState({ isDataSetted: true });
			}
			// setTimeout(() => {
				this.setState({ display: props.display, isSavingItem: false });
			// }, 50);
		} else {
			this.setState({ display: props.display });
		}
	}

	chooseFile = async (fromCamera = false) => {
		if (this.state.selectedPictures.length < 3) { 
			let images = null;
			if (fromCamera) {
				images = await ImagePicker.openCamera({
					multiple: true,
					mediaType: 'photo',
					maxFiles: 3 - this.state.selectedPictures.length,
					compressImageQuality: 0.5,
				});
			} else {
				images = await ImagePicker.openPicker({
					multiple: true,
					mediaType: 'photo',
					maxFiles: 3 - this.state.selectedPictures.length,
					compressImageQuality: 0.5,
				});
			}
			if ((this.state.selectedPictures.length + images.length) > 3) {
				Alert.alert(
					'Image',
					'You cannot upload more than 3 images',
					[{text: 'OK'}]
				);
			} else {
				this.setState({ isSavingItem: true });
				if (images.length) {
					images.forEach(async (element) => {
						await ImageResizer.createResizedImage(element.path, 720, 1280, "JPEG", 20, 0).then((compressedImage) => {
							const { selectedPictures } = this.state;
							selectedPictures.push(compressedImage.uri);
							this.addedImages.push(compressedImage.uri);
							this.setState({
								selectedPictures,
								selectedPictureError: null,
								status: 'unsaved',
								isSavingItem: false
							});
						}).catch((err) => {
							this.showError(err);
						});
					});
				} else {
					await ImageResizer.createResizedImage(images.path, 720, 1280, "JPEG", 20, 0).then((compressedImage) => {
						const { selectedPictures } = this.state;
						selectedPictures.push(compressedImage.uri);
						this.addedImages.push(compressedImage.uri);
						this.setState({
							selectedPictures,
							selectedPictureError: null,
							status: 'unsaved',
							isSavingItem: false
						});
					}).catch((err) => {
						this.showError(err);
					});
				}
			}
		} else {
			Alert.alert(
				'Images',
				'You cannot upload more than 3 images',
				[{text: 'OK'}]
			);
		}
	}

	showError = (message) => {
		this.setState({ isSavingItem: false }, () => {
			setTimeout(() => {
				presentError("Error", message);
			}, 200);
		});
	}

	fetchCategories = async () => {
		this.setState({
			isFetchingCategories: true
		});
		const userId = await getUserId();
		await axios.get(`${Api.url}/${userId}/category`, { headers: Api.headers }).then((response) => {
			if (response.data.status === 'success') {
				this.setState({
					categories: response.data.categories,
					isFetchingCategories: false,
				}, () => {
					if (!this.state.isAvailable) {
						this.setState({
							sizes: JSON.parse(response.data.categories[0].sizes),
							selectedCategory: this.state.categories[0],
							weight: response.data.categories[0].weight,
							selectedWeightUnit: response.data.categories[0].weight_unit
						}, () => {
							this.handleVariantChanges()
						});
					} else {
						const { item } = this.props;
						const temp = this.state.categories.filter((e) => e.id === item.category_id);
						if (temp.length > 0) {
							this.setState({
								selectedCategory: temp[0]
							});
						} else {
							this.setState({
								sizes: JSON.parse(response.data.categories[0].sizes),
								selectedCategory: this.state.categories[0],
								weight: response.data.categories[0].weight,
								selectedWeightUnit: response.data.categories[0].weight_unit
							}, () => {
								this.handleVariantChanges()
							});
						}
					}
				})
			} else {
				this.setState({
					isFetchingCategoriesError: true,
					fetchingCategoriesError: response.data.message,
					isFetchingCategories: false
				})
			}
		}).catch((error) => {
			this.setState({ isFetchingCategories: false });
			this.showError(error.message);
		});
	}

	fetchLocations = async () => {
		this.setState({ isSavingItem: true });
		const userId = await getUserId();
		axios.get(`${Api.url}/${userId}/settings/locations`, { headers: Api.headers }).then(async (response) => {
			const primaryLocation = await axios.get(`${Api.url}/${userId}/settings/primary-location`, { headers: Api.headers });
			console.log(primaryLocation);
			if (response.data.status === 'success') {
				this.setState({
					locations: response.data.locations
				}, () => {
					if (!this.state.isAvailable) {
						this.setState({
							selectedLocation: this.state.locations.find((element) => element.id === primaryLocation.data)
						});
					} else {
						const { item } = this.props;
						const temp = this.state.locations.filter((e) => e.id === item.location_id);
						if (temp.length > 0) {
							this.setState({
								selectedLocation: temp[0]
							});
						} else {
							this.setState({
								selectedLocation: this.state.locations.find((element) => element.id === primaryLocation.data)
							});
						}
					}
				});
			} else {
				this.showError(response.data.message[0])
			}
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	handleOnSizesChanges = (tags) => {
		this.setState({
			sizes: tags.filter((tag) => tag !== "" && tag !== " ")
		}, () => {
			this.handleVariantChanges();
		});
	}

	handleOnTagsChanges = (tags) => {
		this.setState({
			tags: tags.filter((tag) => tag !== "" && tag !== " ")
		});
	}

	handleOnColorsChanges = (tags) => {
		this.setState({
			colors: tags.filter((tag) => tag !== "" && tag !== " ")
		}, () => {
			this.handleVariantChanges();
		});
	}

	handleCategoryChanges = (selectedCategory) => {
		this.setState({ selectedCategory });
		this.selectedCategory = selectedCategory;
		this.setState({
			sizes: JSON.parse(selectedCategory.sizes),
			weight: selectedCategory.weight,
			selectedWeightUnit: selectedCategory.weight_unit
		}, () => {
			this.handleVariantChanges();
		});
	}

	handleVariantChanges = () => {
		this.setState({
			variants: [],
			defaultQuantity: this.state.defaultQuantity || '',
			defaultCost: '',
			defaultPrice: '',
			status: 'unsaved'
        });
		if (this.state.colors.length > 0) {
			if (this.state.sizes.length > 0) {
				for (let i = 0; i < this.state.colors.length; i++) {
					for (let j = 0; j < this.state.sizes.length; j++) {
						this.setState((prevState) => ({
							variants: [
								...prevState.variants,
								{
									size: this.state.sizes[j],
									color: this.state.colors[i] || "",
									quantity: this.state.defaultQuantity,
									variant_price: 0,
									markup_price: 0
								}
							]
						}), () => {
              this.props.handleVariantChanges(this.state.variants);
            });
					}
				}
			} else {
				for (let i = 0; i < this.state.colors.length; i++) {
					this.setState((prevState) => ({
						variants: [
							...prevState.variants,
							{
								size: "",
								color: this.state.colors[i],
								quantity: this.state.defaultQuantity,
								variant_price: 0,
								markup_price: 0
							}
						]
					}), () => {
                        this.props.handleVariantChanges(this.state.variants);
                    });
				}
			}
		} else {
			for (let j = 0; j < this.state.sizes.length; j++) {
				this.setState((prevState) => ({
					variants: [
						...prevState.variants,
						{
							size: this.state.sizes[j],
							color: "",
							quantity: this.state.defaultQuantity,
							variant_price: 0,
							markup_price: 0
						}
					]
				}), () => {
                    this.props.handleVariantChanges(this.state.variants);
                });
			}
		}
	}

	hideDateTimePicker = () => {
		this.setState({ displayShipDatePicker: false });
	};

	handleDatePicked = date => {
		this.setState({
			selectedShipDate: date,
			status: 'unsaved'
		})
		this.hideDateTimePicker();
	};

	getFormattedDate = (date) => {
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
	} 

	getCurrencyFormat = (num) => {
		return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
	}

	getUnitFormat = (num) => {
		return `${num.replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
	}

	getItemTotal = () => {
		let total = 0;
		this.state.variants.forEach((element) => {
			if (element.quantity && element.variant_price) {
				total += element.quantity * parseFloat(element.variant_price.toString().replace(/,/g, ''), 10)
			}
		});
		return total;
	}

	saveItem = async () => {
		if (!this.state.sku) {
			this.setState({
				isSavingItemError: true,
				savingItemError: "The Sku field is required."
			});
			return;
		}
		if (!this.state.selectedCategory) {
			this.setState({
				isSavingItemError: true,
				savingItemError: "Please select category."
			});
			return;
		}

		this.setState({
			isSavingItemError: false,
			savingItemError: ''
		});

		this.setState({
			isSavingItem: true
		});

		// eslint-disable-next-line no-undef
		const data = new FormData();
		data.append("name", this.state.itemName);
		data.append("location_id", (this.state.selectedLocation) ? this.state.selectedLocation.id : null);
		data.append("sku", this.state.sku);
		data.append("category", this.state.selectedCategory.id);
		data.append("colors", JSON.stringify(this.state.colors));
		data.append("sizes", JSON.stringify(this.state.sizes));
		// data.append("tags[]", this.state.tags);
		data.append("price", this.getItemTotal());
		data.append("description", this.state.description);
		data.append("expected_date", (this.state.selectedShipDate !== null) ? this.getFormattedDate(new Date(this.state.selectedShipDate)) : null);
		data.append("variants", JSON.stringify(this.state.variants));
		data.append("barcode", this.state.barcode);
		data.append("weight", this.state.weight || null);
		data.append("weight_unit", this.state.selectedWeightUnit);
		this.state.tags.forEach((element) => {
			data.append("tags[]", element);
		});
		if (this.addedImages.length !== 0) {
			this.addedImages.forEach((element) => {
				data.append("pictures[]", { uri: element, name: `${element.substring(element.lastIndexOf("/") + 1)}`, type: 'image/*' });
			});
		} else {
			data.append("pictures", null);
		} 

		if (this.state.removedImages.length > 0) {
			const imageToRemove = this.state.removedImages.join(',')
			data.append("old_images", imageToRemove);
		} else {
			data.append("old_images", '');
		}

		const userId = await getUserId();
		const { orderId } = this.props;
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Authorization': Api.token,
		}
		let url = '';
		if (this.state.isAvailable) {
			if (this.state.isNew) {
				url = `${Api.url}/${userId}/order/${orderId}/item`;	
			} else {
				url = `${Api.url}/${userId}/order/${orderId}/item/${this.state.id}`;
			}
		} else {
			url = `${Api.url}/${userId}/order/${orderId}/item`;
		}

    console.log(data);
		axios.post(url, data, { headers, processData: false, contentType: false }).then((response) => {
			console.log(response);
			if (response.data.status === 'success') {
				axios.get(`${Api.url}/${userId}/order/${orderId}/item/${response.data.item_id}`, { headers: Api.headers }).then((savedResponse) => {
					if (savedResponse.data.status === 'success') {
						this.setState({ 
							isSavingItem: false,
							status: null,
							id: response.data.item_id,
							isAvailable: true,
							isNew: false,
							removedImages: [],
							selectedPictures: savedResponse.data.item.pictures,
							imageIsNull: savedResponse.data.item.pictures.length === 0
						});
						this.addedImages = [];
						this.props.itemSaved();
						showToast(response.data.message);
					} else {
						this.showError(savedResponse.data.message);
					}
				}).catch((error) => {	
					this.showError(error.message);
				});
			} else {
				this.showError(response.data.message[0]);
			}
		}).catch((error) => {
			this.showError(error.message);
		});

	}

	saveAndAdd = async () => {
		await this.saveItem().then(() => {
			if (!this.state.isSavingItemError) {
				this.props.addNewItem();
			}
		}).catch((error) => {
			this.showError(error.message);
		});
	}

	handleLayout = (event) => {
		this.setState({
			height: event.nativeEvent.layout.height
		});
	}

	verifySku = async () => {
    if (this.state.sku) {
      this.setState({ isVerifyingSku: true });
      const userId = await getUserId();
      axios.get(`${Api.url}/${userId}/order/check-unique-order?sku=${this.state.sku}`, { headers: Api.headers }).then((response) => {
        this.setState({ isVerifyingSku: false });
        this.setState({ skuError: response.data.message });
      }).catch((error) => {
        this.showError(error.message);
      });
    }
	}

	removeImage = (image, index) => {
		if (!this.state.imageIsNull) {
			const { selectedPictures } = this.state;
      selectedPictures.splice(index, 1);
      this.setState({ selectedPictures });
			this.addedImages.splice(this.addedImages.indexOf(image), 1);
			const { removedImages } = this.state;
			removedImages.push(image.substring(image.lastIndexOf("/") + 1));
			this.setState({ status: 'unsaved', removedImages });
		} else {
			const { selectedPictures } = this.state;
      selectedPictures.splice(index, 1);
      this.setState({ selectedPictures });
			this.addedImages.splice(this.addedImages.indexOf(image), 1);
			this.setState({ status: 'unsaved' });
		}
	}

	render() {
		return (
			<Card style={{ marginTop: 10, marginBottom: 0}}>
				
				<View 
					style={[
						styles.cardHeader,
						(this.state.display) ? { height: 70 } : { height: 70, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }
					]}
					onLayout={this.props.onLayout}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<MButton
							text={` ${(this.state.itemName ? this.state.itemName : 'Item')} - ${this.state.sku}`}
							darkBlue
							style={{ paddingHorizontal: 10, maxWidth: 140 }}	
							iconLeft={(
								<Icon name={(this.state.display) ? "minus" : "plus"} color="#fff" />
							)}
							onPress={() => this.props.onPress()}
						/>
						{
							this.state.status !== null && (
								<Badge color={Colors.yellow} style={{ marginHorizontal: 5, height: 30 }}>
									<MText style={{ color: '#000' }} bold size={12}>UNSAVED</MText>
								</Badge>
							)
						}
					</View>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						{
							this.state.isAvailable && this.state.id !== "" && (
								<CopyButton onPress={() => this.props.onCopyItem(this.props.orderId, this.state.id)} />
							)
						}
						{
							!this.props.disableDelete && (
								<DeleteButton onPress={() => this.props.onDeleteItem(this.props.orderId, this.state.id, this.props.index, this.state.isNew)} />
							)
						}
					</View>
				</View>
 
				<Loader loading={this.state.isSavingItem} />
				 	
				
        {
          this.state.display && (
							
					<View 
						style={[
							styles.cardBody,
							{	
								padding: 10, 
								borderTopLeftRadius: 0, 
								borderTopRightRadius: 0, 
								borderTopWidth: 1, 
								borderTopColor: Colors.border,
								overflow: 'scroll',
								height: null
							}
						]}
					>	

						{/* -------------- Form start Here --------------- */}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<MText style={styles.label} size={18}>
								Picture
							</MText>
						</View>
						<View style={{flexDirection: 'row'}}>
							<TouchableOpacity
								style={{ height: 50, borderWidth: 1, borderRadius: 50, justifyContent: 'center', paddingLeft: 20, borderColor: Colors.border, flex: 1, marginRight: 5 }}
								onPress={() => this.chooseFile()}
							>
								<MText size={18}>Choose File</MText>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ height: 50, width: 50, borderWidth: 1, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderColor: Colors.border, backgroundColor: Colors.primary, marginLeft: 5 }}
								onPress={() => this.chooseFile(true)}
							>
								<Icon name="camera" color="#fff" size={24} />
							</TouchableOpacity>
						</View>
						
						{
							this.state.selectedPictureError && (
								<FormError>{this.state.selectedPictureError}</FormError>
							)
						}
						<View style={{flex: 1, flexDirection: 'row'}}>
						{
							this.state.selectedPictures.map((image, index) => (
								<View 
									style={{
										flex:0.33,
										alignItems: 'center', 
										justifyContent: 'center',
										alignSelf: 'center',
										marginHorizontal: 10,
										marginVertical: 30,
									}}
									key={index.toString()}
								>
									<TouchableOpacity
										style={{
											height: 30,
											width: 30,
											borderRadius: 30,
											backgroundColor: '#dc3545',
											alignItems: 'center',
											position: 'absolute',
											top: -14,
											right: -14,
											zIndex: 22,
											justifyContent: 'center',
										}}
										onPress={() => this.removeImage(image, index)}
									>
										<Icon name="times" color="#fff" size={14} />
									</TouchableOpacity>
									<Image
										source={{uri: image}}
										style={{borderWidth: 2, borderColor: Colors.border, height: 100, width: '100%'}}
									/>
								</View>
							))
						} 
						</View>

						<InputBox
							labelNormal
							label="Item Name"
							value={this.state.itemName}
							onChangeText={(itemName) => this.setState({ itemName, status: 'unsaved' })}
						/>
						
						<View style={{marginVertical:5}}>
							<View style={{flexDirection: 'row'}}>
								<MText style={{fontSize: 18, marginLeft: 20, marginVertical: 5}}>
									Sku<MText pink bold>*</MText>
								</MText>
								<ActivityIndicator animating={this.state.isVerifyingSku} size="small" color={Colors.pink} />
							</View>
							<TextInput 
								value={this.state.sku}
								onChangeText={(sku) => {
									this.setState({ sku, status: 'unsaved' })
									if (this.state.duplicateBarcode) {
										this.setState({ barcode: sku });
									}
								}}
								style={styles.textInput}
								onBlur={this.verifySku}
							/>
							{
								this.state.skuError && (
									<MText style={{marginLeft: 20}} pink size={14}>{this.state.skuError}</MText>
								)
							}
						</View>

						<MDropDown
							label="Category"
							placeholder="Select Category"
							data={this.state.categories}
							selectedItem={this.state.selectedCategory}
							onSelectItem={(selectedCategory) => this.handleCategoryChanges(selectedCategory)}
							searchable={true}
							isLoading={this.state.isFetchingCategories}
							isError={this.state.isFetchingCategoriesError}
							error={this.state.fetchingCategoriesError}
						/>

						<View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
							<MText size={18}>Sizes</MText>
						</View>
						<MTag
							initialTags={this.state.sizes}
							placeholder="Select Size"
							handleChanges={this.handleOnSizesChanges}
						/>

						<View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
							<MText size={18}>Colors</MText>
						</View>
						<MTag
							initialTags={this.state.colors}
							placeholder="Select Color"
							handleChanges={this.handleOnColorsChanges}
						/>

						<View 
							style={{ 
								padding: 5, 
								borderWidth:1,
								borderColor:Colors.border,
								borderRadius: 10,
								marginVertical: 10
							}}
							horizontal={true}
						>
							<View>
								<MText size={18}>Default</MText>
							</View>
							<InputBox
								label="Quantity"
								labelNormal
								value={this.state.defaultQuantity?.toString() || ''}
								onChangeText={(defaultQuantity) => this.setState({ defaultQuantity })}
								onEndEditing={(e) => {
									const { variants } = this.state;
									for (let i = 0; i < variants.length; i++) {
										variants[i].quantity = e.nativeEvent.text;
									}
									this.setState({ variants, status: 'unsaved' }, () => this.props.handleVariantChanges(this.state.variants));
								}}
								style={{ flex: 1, marginHorizontal: 5, minWidth: 150, maxWidth: 150}}
								keyboardType={keyBoardType}
							/>

							<View style={{flexDirection: 'row'}}>
								<View style={{flex: 1, marginHorizontal: 5}}>
									<InputBox
										label="Cost"
										labelNormal
										value={this.state.defaultCost.toString()}
										onChangeText={(defaultCost) => {
											this.setState({ defaultCost: this.getUnitFormat(defaultCost) })
										}}
										onEndEditing={(e) => {
											if (e.nativeEvent.text) {
												const value = e.nativeEvent.text.replace(/,/g, '');
												const { variants } = this.state;
												let temp = (parseFloat(value || 0, 10) * this.state.defaultMarkup);
												temp = `${temp.toString().split('.', 1)[0]}.${this.state.roundPrice}`;
												for (let i = 0; i < variants.length; i++) {
													variants[i].variant_price = this.getCurrencyFormat(parseFloat(value, 10));
													variants[i].markup_price = this.getCurrencyFormat(parseFloat(temp, 10));
												}
												this.setState({
													defaultPrice: this.getCurrencyFormat(parseFloat(temp, 10)),
													defaultCost: this.getCurrencyFormat(parseFloat(value, 10))
												}, () => {
													this.setState({ variants, status: 'unsaved' }, () => this.props.handleVariantChanges(this.state.variants));
												});
											}
										}}
										keyboardType={keyBoardType}
									/>
								</View>

								<View style={{flex: 1, marginHorizontal: 5}}>
									<InputBox
										label="Price"
										labelNormal
										value={this.state.defaultPrice.toString()}
										onChangeText={(defaultPrice) => {
											this.setState({ defaultPrice: this.getUnitFormat(defaultPrice) })
										}}
										onEndEditing={(e) => {
											if (e.nativeEvent.text) {
												const value = e.nativeEvent.text.replace(/,/g, '');
												let temp = parseFloat(value || 0, 10);
												temp = `${temp.toString().split('.', 1)[0]}.${this.state.roundPrice}`;
												this.setState({ defaultPrice: this.getCurrencyFormat(parseFloat(value, 10))})
												const { variants } = this.state;
												for (let i = 0; i < variants.length; i++) {
													variants[i].markup_price = this.getCurrencyFormat(parseFloat(temp, 10));
												}
												this.setState({ variants, status: 'unsaved' }, () => this.props.handleVariantChanges(this.state.variants));
											}
										}}
										keyboardType={keyBoardType}
									/>
								</View>
							</View>
						</View>

						{/* ----------------- Table start here ------------ */}

						<View style={styles.tableContainer}>
							<View>
								<TouchableOpacity 
									style={styles.tableHeader}
									activeOpacity={0.7}
									onPress={() => this.setState({ displayVariant: !this.state.displayVariant })}
								>
									<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
										<MText bold size={18}>Variants</MText>
										<Icon name={this.state.displayVariant ? "angle-up" : "angle-down"} color="#000" size={24} />
									</View>
								</TouchableOpacity>
								{
									this.state.displayVariant && (
										
								<View style={styles.tableBody}>

									{
										this.state.variants.map((item, index) => (
											<View style={styles.tableRow} key={index.toString()}>
												<View style={styles.colFirst}>
													<MText size={18}>{item.size}{(item.color && item.size) ? " - " : ""}{item.color}</MText>
												</View>
												<View style={styles.col}>
													<TextInput
														style={styles.tableInput}
														value={String(item.quantity || '')}
														onChangeText={(quantity) => {
															const { variants } = this.state;
															variants[index].quantity = quantity;
															this.setState({ variants, status: 'unsaved' }, () => this.props.handleVariantChanges(this.state.variants));
														}}
														keyboardType={keyBoardType}
													/>
												</View>
												<View style={styles.col}>
													<TextInput
														style={styles.tableInput}
														value={String(item.variant_price || '')}
														onChangeText={(variantPrice) => {
															const { variants } = this.state;
															variants[index].variant_price = this.getUnitFormat(variantPrice);
															this.setState({ variants, status: 'unsaved' }, () => this.props.handleVariantChanges(this.state.variants));
														}}
														onEndEditing={(e) => {
															const value = e.nativeEvent.text.replace(/,/g, '');
															const { variants } = this.state;
															variants[index].variant_price = this.getCurrencyFormat(parseFloat(value, 10))
															this.setState({ variants, status: 'unsaved' });
														}}
														keyboardType={keyBoardType}
													/>
												</View>
												<View style={styles.col}>
													<TextInput
														style={styles.tableInput}
														value={String(item.markup_price || '')}
														onChangeText={(markupPrice) => {
															const { variants } = this.state;
															variants[index].markup_price = this.getUnitFormat(markupPrice);
															this.setState({ variants, status: 'unsaved' }, () => this.props.handleVariantChanges(this.state.variants));
														}}
														onEndEditing={(e) => {
															const value = e.nativeEvent.text.replace(/,/g, '');
															const { variants } = this.state;
															variants[index].markup_price = this.getCurrencyFormat(parseFloat(value, 10))
															this.setState({ variants, status: 'unsaved' });
														}}
														keyboardType={keyBoardType}
													/>
												</View>
												<TrashButton
													onPress={() => {
														Alert.alert(
															"Confirm",
															"Are you sure you want to delete this Variant?",
															[
																{
																	text: 'Cancel',
																	onPress: () => { }
																},
																{
																	text: 'OK',
																	onPress: () => {
																		const { variants } = this.state;
																		variants.splice(index, 1);
																		this.setState({ variants, status:'unsaved' }, () => this.props.handleVariantChanges(this.state.variants));
																	}
																}
															]
														)
													}}
												/>
											</View>
										))
									}

								</View>
									)
								}
							</View>
						</View>

						<View style={{marginVertical: 5}}>
							<MText size={18} style={{marginLeft: 20, marginVertical: 5}}>Weight</MText>
							<View style={{flexDirection: 'row', flex: 1}}>
								<View style={{
									borderWidth: 1, 
									borderColor: Colors.border, 
									borderRadius: 50,
									alignItems: 'center',
									justifyContent: 'center',
									height: 50,
									minWidth: 100,
									maxWidth: 100,
									borderTopRightRadius: 0,
									borderBottomRightRadius: 0
								}}> 
									<RNPickerSelect
										style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5}}
										textInputProps={{textAlign: 'center', fontSize: 20, alignItems: 'center', justifyContent: 'center'}}
										value={this.state.selectedWeightUnit || 'lb'}
										onValueChange={(value) => this.setState({ selectedWeightUnit: value})}
										items={[
											{ label: 'lb', value: 'lb' },
											{ label: 'oz', value: 'oz' },
											{ label: 'kg', value: 'kg' },
											{ label: 'g', value: 'g' }
										]}
									/>
								</View>
								<TextInput
									value={this.state.weight}
									onChangeText={(weight) => this.setState({ weight })}
									onEndEditing={(e) => {
										if (e.nativeEvent.text) {
											this.setState({ weight: parseFloat(e.nativeEvent.text).toFixed(2)})
										}
									}}
									style={[styles.textInput, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}
								/>
							</View>
						</View> 

						<View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
							<MText size={18}>Tags</MText>
						</View>
						<MTag
							initialTags={this.state.tags}
							placeholder="Add Tags"
							handleChanges={this.handleOnTagsChanges}
						/>

						<InputBox
							labelNormal
							label="Barcode"
							value={this.state.barcode}
							onChangeText={(barcode) => this.setState({ barcode, status: 'unsaved' })}
						/>

						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<MText style={styles.label} size={18}>
								Expected Ship Date
							</MText>
						</View>
						<TouchableOpacity
							style={styles.selectBox}
							activeOpacity={1.0}
							onPress={() => {
								this.setState(prevState => ({
									displayShipDatePicker: !prevState.displayShipDatePicker
								}));
							}}
						>
							{/* eslint-disable-next-line no-nested-ternary */}
							<MText size={18}>{(this.state.selectedShipDate === null) ? 'Select Date' : this.state.selectedShipDate.toLocaleDateString()}</MText>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.displayShipDatePicker}
							onConfirm={this.handleDatePicked}
							onCancel={this.hideDateTimePicker}
						/>

						<MDropDown
							label="Location"
							placeholder="Select Location"
							data={this.state.locations}
							searchable={true}
							selectedItem={this.state.selectedLocation}
							onSelectItem={(location) => { this.setState({ selectedLocation: location}) }}
						/>

						<ToggleInputBox
							label="Description"
							value={this.state.description}
							onChangeText={(description) => this.setState({ description, status: 'unsaved' })}
						/>

						{
							this.state.isSavingItemError && (
								<View style={{
									justifyContent: 'center',
									padding: 10,
									backgroundColor: '#f8d7da',
									borderRadius: 10,
									borderWidth: 1,
									borderColor: '#f5c6cb',
									marginVertical: 10
								}}>
									<MText size={16} color="#721c24">{this.state.savingItemError}</MText>
								</View>
							)
						}

						<MButton
							text="SAVE"
							pink
							style={{ marginTop: 20, alignSelf: 'flex-start' }}
							onPress={this.saveItem}
						/>

						<MButton
							text="SAVE & ADD NEW ITEM"
							teal
							style={{ marginVertical: 5, alignSelf: 'flex-start' }}
							onPress={this.saveAndAdd}
						/>

					</View>

					)
				}
				
			</Card>
		);
	}
}

const styles = StyleSheet.create({
	container: {
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
		marginVertical: 10,
	},
	tableHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		paddingVertical: 10,
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	tableBody: {
		padding: 10,
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 5,
		flexWrap: 'wrap',
		padding: 5,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 5,
		flex: 1
	},
	tableInput: {
		padding: 10,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 50,
		width: 100,
		height: 50,
		fontSize: 16,
		fontFamily: 'nunito'
	},
	colFirst: {
		width: 150,
	},
	col: {
		alignItems: 'center',
		marginVertical: 5,
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
	cardBody: {
		backgroundColor: '#ffffff', 
		borderBottomLeftRadius: 10, 
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10, 
		borderTopRightRadius: 10,
	},
	cardHeader: {
		backgroundColor: '#fafbfc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
	},
	textInput: {
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 50,
		fontFamily: 'nunito',
		height: 50,
		paddingVertical: 5,
		paddingHorizontal: 20,
		fontSize: 18
	},
	formField: {

	}
});

export default Item;
