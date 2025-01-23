package com.pharmasight;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class SalesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testDemographicSalesAPI() throws Exception {
        mockMvc
                .perform(MockMvcRequestBuilders.get("/sales-info/demographic")
                        .param("genericId", "1")
                        .param("vendorId", "1")
                        .param("startDate", "2020-01-01")
                        .param("endDate", "2025-06-30")
                        .with(httpBasic("tahsin", "123456"))) // Provide correct credentials
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.divisionSales").isArray())
                .andExpect(MockMvcResultMatchers.jsonPath("$.divisionSales.length()").value(8));
    }
}
