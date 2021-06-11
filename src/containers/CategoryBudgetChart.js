/* eslint-disable operator-assignment */
import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Table, Row, Rows } from 'react-native-table-component';
import Modal from "react-native-modal";
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import MButton from '../components/MButton';
import MText from '../components/MText';
import CreateCategoryBudget from './CreateCategoryBudget';
import MLoader from '../components/Loader';

const EditButton = (id, categoryId, budget, quantity, editBudget) => {
  return (
    <TouchableOpacity
      style={{
        height: 40,
        width: 40,
        borderRadius: 30,
        backgroundColor: Colors.teal,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
      }}
      onPress={() => editBudget(id, categoryId, budget, quantity)}
    >
      <Icon name="edit" color="#fff" size={16} />
    </TouchableOpacity>
  )
}

const DeleteButton = (id, deleteBudget) => {
  return (
    <TouchableOpacity
      style={{
        height: 40,
        width: 40,
        borderRadius: 30,
        backgroundColor: Colors.danger,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
      }}
      onPress={() => deleteBudget(id)}
    >
      <Icon name="trash" color="#fff" size={16} />
    </TouchableOpacity>
  )
}

const MODALFORCREATE = 'modalForCreate';
const MODALFOREDIT = 'modalForEdit';

class CategoryBudgetChart extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Chart',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: (
      <HeaderSearchButton onPress={() => navigation.navigate("Search")} />
    )
  })

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isFetching: false,
      createCategoryBudget: false,
      name: '',
      tableData: [
        ["Categories", "# of Styles", "$", "# of Styles", "$", "# of Styles", "$", "# of Styles", "$", '-', '-']
      ],
      headWidthArr: [350, 200, 200, 200, 100],
      widthArr: [150, 75, 125, 75, 125, 75, 125, 75, 125, 50, 50],
      modalFor: MODALFORCREATE,
      selectedItemId: null,
      selectedItemCategoryId: null,
      selectedItemBudget: null,
      selectedItemNoOfStyles: null
    };
  }

  componentDidMount = () => {
    this.fetchBudgets();
  }

  editBudget = (id, categoryId, budget, quantity) => {
    this.setState({
      selectedItemId: id,
      selectedItemCategoryId: categoryId,
      selectedItemBudget: budget,
      selectedItemNoOfStyles: quantity,
      modalFor: MODALFOREDIT,
    }, () => {
      this.setState({ createCategoryBudget: true })
    });
  }

  doRefresh = () => {
    this.setState({ tableData: [this.state.tableData[0]] }, () => {
      this.fetchBudgets();
    });
  }

  deleteBudget = async (id) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete ?',
      [
        {
          text: 'OK',
          onPress: async () => {
            this.setState({ isFetching: true });
            const userId = await getUserId();
            await axios.get(`${Api.url}/${userId}/budget/category/delete/${id}`, { headers: Api.headers }).then((response) => {
              if (response.data.status === 'success') {
                this.doRefresh();
              } else {
                this.setState({
                  isFetching: false
                }, () => { presentError("Error", response.data.message[0]) });
              }
            }).catch((error) => {
              this.setState({
                isFetching: false
              }, () => { presentError("Error", error.message) });
            });
          }
        },
        {
          text: 'CANCEL'
        }
      ],
      {
        cancelable: true
      }
    );
  }

  currencyFormat = (num) => {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  fetchBudgets = async () => {
    this.setState({ isFetching: true });
    const userId = await getUserId();
    const { timestamp } = this.props.navigation.getParam("item");
    await axios.get(`${Api.url}/${userId}/budget/category/chart/${timestamp}`, { headers: Api.headers }).then(async (response) => {
      if (response.data.status === 'success') {
        this.setState({
          name: response.data.name,
          data: response.data.list
        }, () => {
          const tempData = ['-', 0, 0, 0, 0, 0, 0, 0, 0];
          const { tableData } = this.state;
          this.state.data.forEach((element, index) => {
            tableData.push([
              element.name || '-',
              element.qty || '-',
              `$${element.budget || 0.00}`,
              (element.rows && element.rows.draft) ? element.rows.draft.qty || '-' : '-',
              (element.rows && element.rows.draft) ? `$${element.rows.draft.budget || 0.00}` : '$0.00',
              (element.rows && element.rows.ordered) ? element.rows.ordered.qty || '-' : '-',
              (element.rows && element.rows.ordered) ? `$${element.rows.ordered.budget || 0.00}` : '$0.00',
              `${parseInt(element.qty || 0, 10) - (((element.rows && element.rows.draft) ? parseInt(element.rows.draft.qty || 0, 10) : 0) + ((element.rows && element.rows.closed) ? parseInt(element.rows.closed.qty || 0, 10) : 0) + ((element.rows && element.rows.ordered) ? parseInt(element.rows.ordered.qty || 0, 10) : 0))}`,
              `$${this.currencyFormat((parseInt(element.budget || 0, 10) - (((element.rows && element.rows.draft) ? parseInt(element.rows.draft.budget || 0, 10) : 0) + ((element.rows && element.rows.closed) ? parseInt(element.rows.closed.budget || 0, 10) : 0) + ((element.rows && element.rows.ordered) ? parseInt(element.rows.ordered.budget || 0, 10) : 0))) || 0)}`,
              EditButton(element.id, element.category_id, element.budget, element.qty, this.editBudget),
              DeleteButton(element.id, this.deleteBudget)
            ]);

            tempData[1] = tempData[1] + parseInt(element.qty || 0, 10);
            tempData[2] = tempData[2] + parseInt(element.budget || 0, 10);
            tempData[3] = tempData[3] + parseInt((element.rows && element.rows.draft) ? element.rows.draft.qty || 0 : 0, 10);
            tempData[4] = tempData[4] + parseInt((element.rows && element.rows.draft) ? element.rows.draft.budget || 0 : 0, 10);
            tempData[5] = tempData[5] + parseInt((element.rows && element.rows.ordered) ? element.rows.ordered.qty || 0 : 0, 10);
            tempData[6] = tempData[6] + parseInt((element.rows && element.rows.ordered) ? element.rows.ordered.budget || 0 : 0, 10);
            tempData[7] = tempData[7] + (parseInt(element.qty || 0, 10) - (((element.rows && element.rows.draft) ? parseInt(element.rows.draft.qty || 0, 10) : 0) + ((element.rows && element.rows.closed) ? parseInt(element.rows.closed.qty || 0, 10) : 0) + ((element.rows && element.rows.ordered) ? parseInt(element.rows.ordered.qty || 0, 10) : 0)));
            tempData[8] = tempData[8] + (parseInt(element.budget || 0, 10) - (((element.rows && element.rows.draft) ? parseInt(element.rows.draft.budget || 0, 10) : 0) + ((element.rows && element.rows.closed) ? parseInt(element.rows.closed.budget || 0, 10) : 0) + ((element.rows && element.rows.ordered) ? parseInt(element.rows.ordered.budget || 0, 10) : 0)));

          });
          tableData.push([
            "-",
            tempData[1],
            `$${this.currencyFormat(tempData[2] || 0)}`,
            tempData[3],
            `$${this.currencyFormat(tempData[4] || 0)}`,
            tempData[5],
            `$${this.currencyFormat(tempData[6] || 0)}`,
            tempData[7],
            `$${this.currencyFormat(tempData[8] || 0)}`,
            ' ',
            ' '
          ]);
          this.setState({ tableData, isFetching: false })
        });
      } else {
        this.setState({ isFetching: false, fetchingError: response.data.message });
      }
    }).catch((error) => {
      this.setState({ isFetching: false });
      presentError("Error", error.message);
    });
  }

  renderModalChild = () => {
    if (this.state.modalFor === MODALFORCREATE) {
      return (
        <CreateCategoryBudget
          withoutDate={true}
          selectedDate={this.props.navigation.getParam("item").date}
          closeModal={(isAdded) => {
            this.setState({ createCategoryBudget: false })
            if (isAdded) { this.doRefresh() }
          }}
        />
      )
    }
    return (
      <CreateCategoryBudget
        withoutDate={true}
        selectedDate={this.props.navigation.getParam("item").date}
        forEdit={true}
        id={this.state.selectedItemId}
        categoryId={this.state.selectedItemCategoryId}
        budget={this.state.selectedItemBudget}
        numberOfStyles={this.state.selectedItemNoOfStyles}
        closeModal={(isAdded) => {
          this.setState({ createCategoryBudget: false })
          if (isAdded) { this.doRefresh() }
        }}
      />
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={{ flex: 1, backgroundColor: Colors.bgGray, paddingHorizontal: 15 }}>

          {
            this.state.isFetching && (
              <MLoader isLoading={this.state.isFetching} />
            )
          }

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 15 }}>
            <MText size={28} bold style={{ flex: 1, flexWrap: 'wrap' }}>{this.state.name}</MText>
            <MButton
              teal
              text=" CREATE"
              iconLeft={(
                <Icon name="plus" color="#fff" size={14} />
              )}
              style={{ paddingHorizontal: 10 }}
              onPress={() => {
                this.setState({
                  modalFor: MODALFORCREATE
                }, () => { this.setState({ createCategoryBudget: true }) });
              }}
            />
          </View>

          <ScrollView>
            <View style={styles.tableContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'flex-start' }}
              >
                <Table
                  borderStyle={{ borderColor: Colors.border }}
                  style={{ borderRadius: 10 }}
                  textStyle={{ fontSize: 16, fontFamily: 'nunito' }}
                >
                  <Row
                    data={["Budgeted", "Drafts", "Ordered", "Balance Needed", "Action"]}
                    style={{ flexWrap: 'wrap' }}
                    textStyle={styles.headText}
                    widthArr={this.state.headWidthArr}
                  />
                  <Rows
                    data={this.state.tableData}
                    style={{ flexWrap: 'wrap' }}
                    textStyle={styles.rowText}
                    widthArr={this.state.widthArr}
                  />
                </Table>

              </ScrollView>

            </View>
          </ScrollView>


          <Modal
            isVisible={this.state.createCategoryBudget}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ createCategoryBudget: false })}
          >
            {this.renderModalChild()}
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    paddingHorizontal: 10
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 15
    // borderWidth: 1,
    // borderColor: Colors.border
  },
  row: {
    flexDirection: 'row'
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flexWrap: 'wrap',
    borderWidth: 0.5,
    borderColor: Colors.border
  },
  head: { height: 40, backgroundColor: '#fff' },
  headText: { alignSelf: 'center', fontSize: 18, fontFamily: 'nunito', fontWeight: 'bold', margin: 10 },
  rowText: { alignSelf: 'center', fontSize: 18, fontFamily: 'nunito', margin: 10 }
})

export default CategoryBudgetChart;
