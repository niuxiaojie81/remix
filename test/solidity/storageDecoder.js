'use strict'
var tape = require('tape')
var compiler = require('solc')
var stateDecoder = require('../../src/index').solidity.stateDecoder

tape('solidity', function (t) {
  t.test('storage decoder', function (st) {
    testIntStorage(st)
  })
})

function testIntStorage (st) {
  var intStorage = require('./contracts/intStorage')
  var output = compiler.compile(intStorage.contract, 0)
  var decoded = stateDecoder.solidityState(intStorage.fullStorage, output.sources, 'intStorage')
  st.equal(decoded['ui8'], '130')
  st.equal(decoded['ui16'], '456')
  st.equal(decoded['ui32'], '4356')
  st.equal(decoded['ui64'], '3543543543')
  st.equal(decoded['ui128'], '234567')
  st.equal(decoded['ui256'], '115792089237316195423570985008687907853269984665640564039457584007880697216513')
  st.equal(decoded['ui'], '123545666')
  st.equal(decoded['i8'], '-45')
  st.equal(decoded['i16'], '-1234')
  st.equal(decoded['i32'], '3455')
  st.equal(decoded['i64'], '-35566')
  st.equal(decoded['i128'], '-444444')
  st.equal(decoded['i256'], '3434343')
  st.equal(decoded['i'], '-32432423423')
  st.equal(decoded['ishrink'], '2')

  var shrinkedStorage = shrinkStorage(intStorage.fullStorage)
  decoded = stateDecoder.solidityState(shrinkedStorage, output.sources, 'intStorage')
  st.equal(decoded['ui8'], '130')
  st.equal(decoded['ui16'], '456')
  st.equal(decoded['ui32'], '4356')
  st.equal(decoded['ui64'], '3543543543')
  st.equal(decoded['ui128'], '234567')
  st.equal(decoded['ui256'], '115792089237316195423570985008687907853269984665640564039457584007880697216513')
  st.equal(decoded['ui'], '123545666')
  st.equal(decoded['i8'], '-45')
  st.equal(decoded['i16'], '-1234')
  st.equal(decoded['i32'], '3455')
  st.equal(decoded['i64'], '-35566')
  st.equal(decoded['i128'], '-444444')
  st.equal(decoded['i256'], '3434343')
  st.equal(decoded['i'], '-32432423423')
  st.equal(decoded['ishrink'], '2')

  decoded = stateDecoder.solidityState({}, output.sources, 'intStorage')
  st.equal(decoded['ui8'], '0')
  st.equal(decoded['ui16'], '0')
  st.equal(decoded['ui32'], '0')
  st.equal(decoded['ui64'], '0')
  st.equal(decoded['ui128'], '0')
  st.equal(decoded['ui256'], '0')
  st.equal(decoded['ui'], '0')
  st.equal(decoded['i8'], '0')
  st.equal(decoded['i16'], '0')
  st.equal(decoded['i32'], '0')
  st.equal(decoded['i64'], '0')
  st.equal(decoded['i128'], '0')
  st.equal(decoded['i256'], '0')
  st.equal(decoded['i'], '0')
  st.equal(decoded['ishrink'], '0')
  st.end()
}

function shrinkStorage (storage) {
  var shrinkedStorage = {}
  var regex = /0x(00)*(..)/
  for (var key in storage) {
    var value = storage[key]
    shrinkedStorage[key.replace(regex, '0x$2')] = value.replace(regex, '0x$2')
  }
  return shrinkedStorage
}
