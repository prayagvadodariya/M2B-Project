import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Tags from 'react-native-tags-hapo';
import MText from './MText';
import Colors from '../../config/Colors';

class MTag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialTags: this.props.initialTags,
		};
	}

	componentWillReceiveProps = (props) => {
		this.setState({
			initialTags: props.initialTags
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.initialTags.length !== nextState.initialTags.length) {
			return false 
		} 
		return true
	}

	handleChanges = (tags) => {
		this.setState({
			initialTags: tags
		}, () => this.props.handleChanges(this.state.initialTags));
	}

	render() {
		return (
			<Tags
				initialText=""
				textInputProps={{ placeholder: (this.props.disabled) ? "" : this.props.placeholder, blurOnSubmit: false }}
				initialTags={this.state.initialTags}
				onChangeTags={this.handleChanges}
				createTagOnString={[","]}
				createTagOnReturn={true}
				containerStyle={[styles.tagContainer, {...(this.props.disabled) ? {backgroundColor: '#e9ecef'} : {}}]}
				inputStyle={{ backgroundColor: "white" }}
				renderTag={({ tag, index, onPress }) => (
					<TouchableOpacity style={styles.tag} onPress={onPress} key={index.toString()}>
						<Icon name="times" color="#aaa" />
						<MText>{' '}{tag}</MText>
					</TouchableOpacity>
				)}
			/>
		);
	}
}

const styles = StyleSheet.create({
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
	}
});

export default MTag;
