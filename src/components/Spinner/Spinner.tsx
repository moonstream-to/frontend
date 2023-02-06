import { Image } from '@chakra-ui/react'
import styles from './Spinner.module.css'

const Spinner = ({ progress, ...props }: { progress?: number; [props: string]: unknown }) => {
  return (
    <Image className={styles.spinner} src='/favicon.png' alt='spinner' w='32px' h='32px' opacity={progress ? progress : 1} {...props} />
  )
}

export default Spinner
