import React, { Component } from 'react';
import { Text, SafeAreaView } from 'react-native';
import Picker from 'react-native-multiple-picker';
import MText from './MText';
import Colors from '../../config/Colors';

class YearMonthSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDate: null
		};
	}

	render() {
		const firstYear = new Date(Date.now()).getFullYear();
		const years = new Array(101).fill({ label: null }).map((item, id) => {
			return { label: id + firstYear, key: id }
		});

		const months = new Array(12).fill({ label: null }).map((item, id) => {
			return { label: (id < 9) ? `0${id + 1}` : `${id + 1}`, key: id }
		});


		const data = [years, months];
		const label = ['Year', 'Month'];

		let cm = new Date(Date.now()).getMonth() + 1;
		if (cm < 10) { cm = `0${cm}` } else { cm = `${cm}` }
		const currentMonth = months.find((item) => item.label === cm);
		const currentYear = years.find((item) => item.label === (new Date(Date.now()).getFullYear()));
		const selectedValue = [years.indexOf(currentYear), months.indexOf(currentMonth)];
		return (
			<Picker
				data={data}
				initValue={selectedValue}
				onChange={(option) => {
					const selectedDate = `${years[option[0]].label}-${months[option[1]].label}`
					this.setState({ selectedDate });
					this.props.onChange(selectedDate);
				}}
				label={label}
				style={{
					borderWidth: 1,
					borderColor: Colors.border,
					borderRadius: 50,
					height: 50,
					paddingVertical: 5,
					paddingHorizontal: 20,
					justifyContent: 'center',
					fontSize: 18,
					...this.props.style
				}}
			>
				{
					this.state.selectedDate ? (
						<Text style={{
							fontFamily: "nunito",
							fontSize: 18,
							color: "#000"
						}}>
							{this.state.selectedDate}
						</Text>
					) : (
						<Text style={{
							fontFamily: "nunito",
							fontSize: 18,
							color: "#aaa"
						}}>
							{this.props.placeholder}
						</Text>
					)
				}
			</Picker>
		);
	}
}

export default YearMonthSelector;
