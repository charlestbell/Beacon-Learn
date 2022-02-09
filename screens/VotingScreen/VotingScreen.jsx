import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import * as utils from './VotingScreenUtils';

const TopicTile = ({ topic, changeBeforeVote }) => {
  return (
    <View style={styles.TTContainer}>
      <Text style={styles.TTTitleText}>{topic.name} </Text>
      <View style={styles.TTArrowContainer}>
        <TouchableOpacity onPress={changeBeforeVote.bind(this, topic.name)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
        <FontAwesomeIcon icon={faArrowRight} />
      </View>
    </View>
  );
};

const VotingScreen = () => {
  const [topicsOrder, setTopicsOrder] = useState([]);
  const [topics, setTopics] = useState([
    {
      name: 'ISO',
      beforeVotes: {
        Aperture: {
          total: 4,
          addresses: [
            'charlestbell@gmail.com',
            'test@test.com',
            'sample@sample.com',
            'something@something.com',
          ],
        },
      },
      afterVotes: {
        Aperture: { total: 1, addresses: ['original@original.com'] },
      },
    },
    { name: 'Aperture', beforeVotes: {}, afterVotes: {} },
    { name: 'Shutter Speed', beforeVotes: {}, afterVotes: {} },
    { name: 'Tripods', beforeVotes: {}, afterVotes: {} },
    { name: 'What is photography?', beforeVotes: {}, afterVotes: {} },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Choose a topic</Text>
      <View style={styles.tileField}>
        {topics.map((topic, i) => (
          <TopicTile
            topic={topic}
            key={i}
            changeBeforeVote={() =>
              utils.changeBeforeVote(topic.name, topics, setTopics)
            }
          />
        ))}
      </View>
    </View>
  );
};

export default VotingScreen;

const styles = StyleSheet.create({
  TTArrowContainer: {
    marginBottom: 6,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  TTTitleText: { color: 'white', fontWeight: 'bold' },
  TTContainer: {
    height: 75,
    width: 120,
    backgroundColor: 'orangered',
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  tileField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  container: {
    marginTop: 60,
  },
  pageTitle: { fontSize: 32, fontWeight: '500', marginLeft: 10 },
});

TopicTile.propTypes = {
  topic: PropTypes.object,
  changeBeforeVote: PropTypes.func,
};
