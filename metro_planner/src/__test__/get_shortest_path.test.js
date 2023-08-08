const neo4j = require('neo4j-driver');
const shortestPath = require('../components/get_shortest_path');
const exp = require('node:constants');
const fs = require('node:fs').promises;

const uri = 'neo4j://165.22.248.255';
const user = 'root';
const password = '12345678';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

describe('Shortest Path test', () => {
  test('input Station that does not exist (empty string station)', async () => {
    const result = await shortestPath.get_shortest_route(
      '',
      'Osaka-Umeda',
      'Kansai Thru Pass'
    );
    expect(result).toStrictEqual([[], []]);
  });

  test('input Station that does not exist (wrong name)', async () => {
    const result = await shortestPath.get_shortest_route(
      'HaHa',
      'Osaka-Umeda',
      'Kansai Thru Pass'
    );
    expect(result).toStrictEqual([[], []]);
  });

  test('Start and Dest same stations', async () => {
    const result = await shortestPath.get_shortest_route(
      'Osaka-Umeda',
      'Osaka-Umeda',
      'Kansai Thru Pass'
    );
    expect(result).toStrictEqual([[], []]);
  });

  test('One station to neighbouring station', async () => {
    const result = await shortestPath.get_shortest_route(
      'Uenoshi',
      'Iga-Ueno',
      'Kansai Thru Pass'
    );
    // expect(result).toStrictEqual(['Uenoshi', 'Iga-Ueno'], ['Iga Tetsudo Line'])
    expect(result).toStrictEqual([
      ['Iga Tetsudo Line'],
      ['Uenoshi', 'Iga-Ueno'],
    ]);
  });

  test('Same route returned when start and destination are swapped (Bidirectionality)', async () => {
    const result1 = await shortestPath.get_shortest_route(
      'Osaka Airport',
      'Kintetsu-Yokkaichi',
      'Kansai Thru Pass'
    );
    const result2 = await shortestPath.get_shortest_route(
      'Kintetsu-Yokkaichi',
      'Osaka Airport',
      'Kansai Thru Pass'
    );
    const result = [result1[0].reverse(), result1[1].reverse()];
    console.log(result1, result2);
    expect(result).toStrictEqual(result2);
  });

  test('Start and Dest different stations (with different railway lines)', async () => {
    const result = await shortestPath.get_shortest_route(
      'Osaka-Umeda',
      'Kyoto-kawaramachi',
      'Kansai Thru Pass'
    );
    // expect(result).toStrictEqual([ 'Osaka-Umeda', 'Juso', 'Kyoto-kawaramachi' ],[ 'Hankyu-Takarazuka Line', 'Hankyu-Kyoto Line'])
    expect(result).toStrictEqual([
      ['Hankyu-Takarazuka Line', 'Hankyu-Kyoto Line'],
      ['Osaka-Umeda', 'Juso', 'Kyoto-kawaramachi'],
    ]);
  });

  test('With empty string for pass', async () => {
    const result = await shortestPath.get_shortest_route(
      'Kinosakionsen',
      'Gifu',
      ''
    );
    expect(result).toStrictEqual([[], []]);
  });

  test('One End to another End station of 1 railway only (JR)', async () => {
    const result = await shortestPath.get_shortest_route(
      'Kinosakionsen',
      'Gifu',
      'JR Pass'
    );
    expect(result).toStrictEqual([
      [
        'Maizuru Line',
        'San-in Line',
        'Bantan Line',
        'JR Takarazuka Line',
        'Shinkansen',
        'Tokaido Main Line',
      ],
      [
        'Kinosakionsen',
        'Toyooka',
        'Wadayama',
        'Himeji',
        'Nishi-Akashi',
        'Maibara',
        'Gifu',
      ],
    ]);
  });

  test('One End to another End station of 1 railway only (Kansai)', async () => {
    const result = await shortestPath.get_shortest_route(
      'Shiomibashi',
      'Wakayamako',
      'Kansai Thru Pass'
    );
    expect(result).toStrictEqual([
      ['Nankai Electric Railway'],
      ['Shiomibashi', 'Wakayamako'],
    ]);
  });

  test('With incorrect pass', async () => {
    const result = await shortestPath.get_shortest_route(
      'Kinosakionsen',
      'Gifu',
      'Kansai Thru Pass'
    );
    expect(result).toStrictEqual([[], []]);
  });

  test('One End to another End station (one pass)', async () => {
    const result = await shortestPath.get_shortest_route(
      'Yoshino',
      'Ebara',
      'Kansai Thru Pass'
    );
    expect(result).toStrictEqual([[], []]);
  });

  test('One End to another End station (both pass)', async () => {
    const result = await shortestPath.get_shortest_route(
      'Kinosakionsen',
      'Kashikojima',
      'Both'
    );
    expect(result).toStrictEqual([
      [
        'Maizuru Line',
        'San-in Line',
        'Bantan Line',
        'JR Takarazuka Line',
        'Shinkansen',
        'Tokaido Main Line',
        'Yoro Railway',
        'walk',
        'Tokaido Main Line',
        'Kansai Main Line',
        'Ise Railway',
        'Kisei Main Line',
        'Kintetsu Yamada Line',
        'Sangu Line',
        'Kintetsu Shima Line',
      ],

      [
        'Kinosakionsen',
        'Toyooka',
        'Wadayama',
        'Himeji',
        'Nishi-Akashi',
        'Maibara',
        'Ogaki',
        'Nishikuwana',
        'Kuwana',
        'Yokkaichi',
        'Kawarada',
        'Tsu',
        'Matsusaka',
        'Iseshi',
        'Toba',
        'Kashikojima',
      ],
    ]);
  });
});
