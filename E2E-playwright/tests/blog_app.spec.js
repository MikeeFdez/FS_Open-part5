const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Con las siguientes lineas vaciamos la BBDD y creamos un nuevo usuario para las pruebas.
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name:"Tony Stark",
        username: "IronMan",
        password: "awesome"
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.getByText('Log in to application')
    await expect(loginForm).toBeVisible()
    await expect(page.getByText('Username')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()

  })

  describe('Login', () => {
    test('Succeeds with correct credentials', async ({ page }) => {
      // Los métodos first y last sólo funcionan bien si hay dos campos a rellenar en el formulario. Si hubiesen más, es mejor usar getByTestId
      // y en el componente añadirle un data-testid a los inputs para poder identificarlos.
      await page.getByRole('textbox').first().fill('IronMan')
      await page.getByRole('textbox').last().fill('awesome')
      await page.getByRole('button', {name: 'Log In'}).click()

      await expect(page.getByText('Tony Stark logged in')).toBeVisible()
    })

    test('Fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('Mandarin')
      await page.getByRole('textbox').last().fill('awesome')
      await page.getByRole('button', {name: 'Log In'}).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('IronMan')
      await page.getByRole('textbox').last().fill('awesome')
      await page.getByRole('button', {name: 'Log In'}).click()
    })

    test('A new blog can be created', async ({ page }) => {
      await page.getByRole('button', {name: 'New Blog'}).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('Reservoir Dogs')
      await textboxes[1].fill('Quentin Tarantino')
      await textboxes[2].fill('UrlNotAvailable')
      await page.getByRole('button', {name: 'Create'}).click()

      await expect(page.getByText('New Entry was added. Great!')).toBeVisible()
      await expect(page.getByRole('button', {name: 'Show details'})).toBeVisible()
    })
    
    describe('When there are blogs already in the DB', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', {name: 'New Blog'}).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Reservoir Dogs')
        await textboxes[1].fill('Quentin Tarantino')
        await textboxes[2].fill('UrlNotAvailable')
        await page.getByRole('button', {name: 'Create'}).click()
      })

      test('A blog can be edited adding more likes', async ({ page }) => {
        await page.getByRole('button', {name: 'Show details'}).click()
        await page.getByRole('button', {name: 'Likes'}).click()
  
        await expect(page.getByTestId('likes')).toContainText("1")
      })
  
      test('A blog can be deleted only by the user that created it', async ({ page }) => {

        // page.on('dialog', async (dialog) => {
        //   expect(dialog.type()).toContain('confirm')
        //   expect(dialog.message()).toContain('Do you want to delete Reservoir Dogs from Quentin Tarantino?')
        //   await dialog.accept()
        // })

        await page.getByRole('button', {name: 'Show details'}).click()
        await expect(page.getByRole('button', {name: 'remove'})).toBeHidden()
      })
    })

    describe('When there are a few blog entries', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', {name: 'New Blog'}).click()
        const textboxes = await page.getByRole('textbox').all()
        
        await textboxes[0].fill('Reservoir Dogs')
        await textboxes[1].fill('Quentin Tarantino')
        await textboxes[2].fill('UrlNotAvailable')
        await page.getByRole('button', {name: 'Create'}).click()

        await page.getByRole('button', {name: 'New Blog'}).click()
        await textboxes[0].fill('Pulp Fiction')
        await textboxes[1].fill('Quentin Tarantino')
        await textboxes[2].fill('UrlNotAvailable')
        await page.getByRole('button', {name: 'Create'}).click()

        await page.getByRole('button', {name: 'New Blog'}).click()
        await textboxes[0].fill('Kill Bill')
        await textboxes[1].fill('Quentin Tarantino')
        await textboxes[2].fill('UrlNotAvailable')
        await page.getByRole('button', {name: 'Create'}).click()
      })

      test('Checking if blogs are sorted', async ({ page }) => {
        const details = await page.getByRole('button', {name: 'Show details'}).all()
        await details[1].click()
        await page.getByRole('button', {name: 'Likes'}).click()

        const blogEntries = await page.getByTestId("entry").all()
        await expect(blogEntries[0]).toContainText('Pulp Fiction - Quentin Tarantino')
      })
    })
  })
})