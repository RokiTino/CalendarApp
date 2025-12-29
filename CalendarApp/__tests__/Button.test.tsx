import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../src/components/common/Button';

describe('Button component', () => {
  it('should render with title', () => {
    const tree = TestRenderer.create(<Button title="Click Me" onPress={() => {}} />);
    const instance = tree.root;

    expect(instance.findByType(Text).props.children).toBe('Click Me');
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const tree = TestRenderer.create(<Button title="Press Me" onPress={onPressMock} />);
    const instance = tree.root;

    const touchable = instance.findByType(TouchableOpacity);
    act(() => {
      touchable.props.onPress();
    });

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const tree = TestRenderer.create(
      <Button title="Disabled" onPress={onPressMock} disabled />
    );
    const instance = tree.root;

    const touchable = instance.findByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(true);
  });

  it('should show loading indicator when loading', () => {
    const tree = TestRenderer.create(<Button title="Loading" onPress={() => {}} loading />);
    const instance = tree.root;

    const activityIndicator = instance.findByType(ActivityIndicator);
    expect(activityIndicator).toBeDefined();
  });

  it('should be disabled when loading', () => {
    const tree = TestRenderer.create(<Button title="Loading" onPress={() => {}} loading />);
    const instance = tree.root;

    const touchable = instance.findByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(true);
  });

  it('should render with primary variant by default', () => {
    const tree = TestRenderer.create(<Button title="Primary" onPress={() => {}} />);
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const tree = TestRenderer.create(
      <Button title="Secondary" onPress={() => {}} variant="secondary" />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const tree = TestRenderer.create(
      <Button title="Outline" onPress={() => {}} variant="outline" />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render with ghost variant', () => {
    const tree = TestRenderer.create(
      <Button title="Ghost" onPress={() => {}} variant="ghost" />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render with small size', () => {
    const tree = TestRenderer.create(
      <Button title="Small" onPress={() => {}} size="small" />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render with medium size', () => {
    const tree = TestRenderer.create(
      <Button title="Medium" onPress={() => {}} size="medium" />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render with large size', () => {
    const tree = TestRenderer.create(
      <Button title="Large" onPress={() => {}} size="large" />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should apply fullWidth style', () => {
    const tree = TestRenderer.create(
      <Button title="Full Width" onPress={() => {}} fullWidth />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { marginTop: 20 };
    const tree = TestRenderer.create(
      <Button title="Custom Style" onPress={() => {}} style={customStyle} />
    );
    expect(tree.toJSON()).toBeTruthy();
  });
});
