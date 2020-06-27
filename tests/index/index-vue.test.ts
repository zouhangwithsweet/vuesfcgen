import { mount } from '@vue/test-utils'
import Index from './Index.vue'

test('default', () => {
    const wrapper = mount(Index)
    expect(wrapper.html()).toMatchSnapshot()
})

// TODO: test vue generator heres
test('generator', () => {
})
