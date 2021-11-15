import React from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'

const CustomLoader = (props) => (
    <>
        {
            props.data.map(item => {
                return (
                    <ContentLoader
                        key={item}
                        animationEnabled={true}
                        speed={2}
                        width={350}
                        height={160}
                        viewBox="0 0 300 160"
                        backgroundColor={'#ccc'}
                        foregroundColor="white"
                        {...props}
                    >
                        <Rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
                        <Rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
                        <Rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
                        <Rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
                        <Rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
                        <Circle cx="20" cy="20" r="20" />
                    </ContentLoader>
                )
            })
        }
    </>
)

export default CustomLoader;